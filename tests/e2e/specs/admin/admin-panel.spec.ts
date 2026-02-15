import { test, expect, TEST_USERS } from '../../fixtures';
import { loginAs, clearAuthState } from '../../helpers/test-utils';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
  });

  test('should be accessible by admin users', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  });

  test('should redirect non-admin users', async ({ page }) => {
    await loginAs(page, 'user');
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display user list', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');
    await expect(page.getByText(TEST_USERS.admin.email)).toBeVisible();
    await expect(page.getByText(TEST_USERS.user.email)).toBeVisible();
  });
});
