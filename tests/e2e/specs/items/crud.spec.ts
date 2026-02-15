import { test, expect } from '../../fixtures';
import { loginAs, clearAuthState } from '../../helpers/test-utils';
import { ItemsPage } from '../../pages/items.page';

test.describe('Items CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
    await loginAs(page, 'user');
  });

  test('should display items list', async ({ page }) => {
    const itemsPage = new ItemsPage(page);
    await itemsPage.goto();
    await itemsPage.expectLoaded();
  });

  test('should navigate to create item form', async ({ page }) => {
    const itemsPage = new ItemsPage(page);
    await itemsPage.goto();
    await itemsPage.newItemButton.click();
    await expect(page).toHaveURL(/\/items\/new/);
    await expect(page.getByRole('heading', { name: 'New Item' })).toBeVisible();
  });

  test('should create a new item', async ({ page }) => {
    const itemsPage = new ItemsPage(page);
    await itemsPage.goto();
    await itemsPage.createItem('Test Item', 'This is a test item description');
    await expect(page.getByText('Test Item')).toBeVisible();
  });
});
