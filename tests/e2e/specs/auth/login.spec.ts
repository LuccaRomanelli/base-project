import { test, expect, TEST_USERS } from '../../fixtures';
import { LoginPage } from '../../pages/login.page';
import { clearAuthState } from '../../helpers/test-utils';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearAuthState(page);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.loginAs('user');
    await page.waitForURL('/dashboard');
    await expect(page.getByText(TEST_USERS.user.fullName)).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await loginPage.expectError();
  });

  test('should persist session after page reload', async ({ page }) => {
    await loginPage.loginAs('user');
    await page.waitForURL('/dashboard');
    await page.reload();
    await expect(page.getByText(TEST_USERS.user.fullName)).toBeVisible();
  });

  test('should logout and clear session', async ({ page }) => {
    await loginPage.loginAs('user');
    await page.waitForURL('/dashboard');
    await page.getByRole('button', { name: /sign out/i }).click();
    await page.waitForURL('/');
    await page.goto('/dashboard');
    await expect(page.getByLabel('Email')).toBeVisible();
  });
});
