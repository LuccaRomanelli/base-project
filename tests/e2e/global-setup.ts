/**
 * Playwright Global Setup
 * Runs before all tests to ensure database is reset and Supabase is running
 */

import { execSync, spawn } from 'child_process';

async function waitForSupabase(maxAttempts = 30, intervalMs = 2000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      execSync('curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null', {
        stdio: 'ignore',
      });
      return true;
    } catch {
      console.log(`  Waiting for Supabase... (${i + 1}/${maxAttempts})`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}

async function ensureSupabaseRunning(): Promise<void> {
  console.log('Checking if Supabase is running...');

  try {
    execSync('curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null', {
      stdio: 'ignore',
    });
    console.log('Supabase is already running\n');
    return;
  } catch {
    console.log('Supabase is not running. Starting...');
  }

  const supabaseProcess = spawn('npx', ['supabase', 'start'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    detached: true,
  });
  supabaseProcess.unref();

  const isReady = await waitForSupabase();
  if (!isReady) {
    throw new Error('Timeout waiting for Supabase to start');
  }
  console.log('Supabase started successfully\n');
}

async function resetDatabase(): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');
  const seedBackupPath = seedPath + '.bak';

  if (fs.existsSync(seedPath)) {
    fs.renameSync(seedPath, seedBackupPath);
  }

  try {
    console.log('  Running migrations...');
    try {
      execSync('npx supabase db reset', {
        cwd: process.cwd(),
        stdio: 'inherit',
        timeout: 300000,
      });
    } catch {
      console.log('  Note: db reset returned an error, waiting for Supabase to recover...');
    }

    const isReady = await waitForSupabase(30, 2000);
    if (!isReady) {
      throw new Error('Supabase did not recover after database reset');
    }

    if (fs.existsSync(seedBackupPath)) {
      fs.renameSync(seedBackupPath, seedPath);
    }

    console.log('  Applying seed via Docker...');
    const dbContainer = execSync(
      'docker ps --filter "name=supabase_db_" --format "{{.Names}}" | head -1',
      { encoding: 'utf8' },
    ).trim();
    if (!dbContainer) {
      throw new Error('Could not find Supabase database container');
    }
    execSync(`docker exec -i ${dbContainer} psql -U postgres -d postgres < ${seedPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
      timeout: 60000,
    });

    // Create auth users
    console.log('  Creating auth users...');
    const authUsersSql = `
      INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, recovery_token, email_change_token_new, email_change) VALUES
        ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'admin@test.com', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
        ('00000000-0000-0000-0000-000000000000', 'a2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'user@test.com', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', '')
      ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = NOW();

      INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at)
        SELECT id, id, jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), 'email', id::text, NOW(), NOW(), NOW()
        FROM auth.users
        WHERE email IN ('admin@test.com', 'user@test.com')
      ON CONFLICT (id) DO NOTHING;
    `;
    execSync(
      `docker exec -i ${dbContainer} psql -U postgres -d postgres -c "${authUsersSql.replace(/"/g, '\\\\"')}"`,
      { cwd: process.cwd(), stdio: 'inherit', timeout: 30000 },
    );
  } finally {
    const fs2 = await import('fs');
    if (fs2.existsSync(seedBackupPath)) {
      fs2.renameSync(seedBackupPath, seedPath);
    }
  }
}

async function updateEnvLocal(): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');

  console.log('  Updating .env.local with Supabase credentials...');

  try {
    const statusOutput = execSync('npx supabase status --output json 2>/dev/null', {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    const jsonStart = statusOutput.indexOf('{');
    if (jsonStart === -1) {
      throw new Error('Could not find JSON in supabase status output');
    }
    const jsonStr = statusOutput.slice(jsonStart);
    const status = JSON.parse(jsonStr) as Record<string, string>;

    const supabaseUrl = status.API_URL ?? 'http://127.0.0.1:54321';
    const anonKey = status.ANON_KEY;

    if (!anonKey) {
      throw new Error('Could not get ANON_KEY from supabase status');
    }

    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${anonKey}\n`;
    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);
    console.log('  .env.local updated successfully');
  } catch (error) {
    console.error('  Warning: Could not update .env.local:', error);
  }
}

async function globalSetup(): Promise<void> {
  console.log('\n========================================');
  console.log('   E2E TEST SETUP');
  console.log('========================================\n');

  await ensureSupabaseRunning();

  console.log('Resetting database...');
  try {
    await resetDatabase();
    console.log('Database reset complete\n');
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }

  await updateEnvLocal();

  const fs = await import('fs');
  const path = await import('path');
  const viteCachePath = path.join(process.cwd(), 'node_modules', '.vite');
  if (fs.existsSync(viteCachePath)) {
    console.log('  Clearing Vite cache...');
    fs.rmSync(viteCachePath, { recursive: true, force: true });
  }

  console.log('========================================');
  console.log('   SETUP COMPLETE - STARTING TESTS');
  console.log('========================================\n');
}

export default globalSetup;
