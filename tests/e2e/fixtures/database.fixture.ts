import { execSync } from 'child_process';

export function resetDatabase(): void {
  execSync('npm run db:reset', {
    cwd: process.cwd(),
    stdio: 'inherit',
    timeout: 120000,
  });
}

export function isSupabaseRunning(): boolean {
  try {
    execSync('curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null', {
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

export async function waitForSupabase(maxAttempts = 15, intervalMs = 2000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    if (isSupabaseRunning()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
