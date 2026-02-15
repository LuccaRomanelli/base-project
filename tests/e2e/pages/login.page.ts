import type { Page, Locator } from '@playwright/test';
import { TEST_USERS } from '../fixtures/auth.fixture';
import type { TestUserRole } from '../fixtures/auth.fixture';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.locator('.bg-red-50');
    this.signupLink = page.getByRole('link', { name: 'Sign up' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(role: TestUserRole) {
    const user = TEST_USERS[role];
    await this.login(user.email, user.password);
  }

  async expectLoginForm() {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  async expectError(message?: string) {
    await this.errorMessage.waitFor({ state: 'visible' });
    if (message) {
      await this.errorMessage.filter({ hasText: message }).waitFor();
    }
  }
}
