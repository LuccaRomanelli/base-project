import type { Page, Locator } from '@playwright/test';

export class ItemsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newItemButton: Locator;
  readonly itemCards: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Items' });
    this.newItemButton = page.getByRole('link', { name: /new item/i });
    this.itemCards = page.locator('[class*="rounded-xl"]');
    this.emptyState = page.getByText('No items yet');
  }

  async goto() {
    await this.page.goto('/items');
  }

  async expectLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }

  async createItem(title: string, description: string) {
    await this.newItemButton.click();
    await this.page.getByLabel('Title').fill(title);
    await this.page.getByLabel('Description').fill(description);
    await this.page.getByRole('button', { name: /create/i }).click();
    await this.page.waitForURL('/items');
  }
}
