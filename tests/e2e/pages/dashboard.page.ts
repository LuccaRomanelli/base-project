import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly totalItems: Locator;
  readonly newItemButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.totalItems = page.locator('text=Total Items').locator('..');
    this.newItemButton = page.getByRole('link', { name: /new item/i });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }
}
