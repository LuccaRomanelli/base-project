import type { Page } from '@playwright/test';
import { TEST_USERS } from '../fixtures/auth.fixture';
import type { TestUserRole } from '../fixtures/auth.fixture';

/**
 * Login as a test user via the UI
 */
export async function loginAs(page: Page, role: TestUserRole): Promise<void> {
  const user = TEST_USERS[role];
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('/dashboard');
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: /sign out/i }).click();
  await page.waitForURL('/');
}

/**
 * Clear auth state (localStorage tokens)
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    }
  });
}

/**
 * Wait for a network request to complete
 */
export async function waitForApi(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForResponse(
    (response) =>
      (typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) && response.status() < 400,
  );
}
