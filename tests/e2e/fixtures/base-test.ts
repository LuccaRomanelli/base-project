import { test as base } from '@playwright/test';

/**
 * Extended test with anti-flake configuration.
 * Use this instead of importing `test` from @playwright/test directly.
 */
export const test = base.extend({
  // Auto-dismiss any dialogs
  page: async ({ page }, use) => {
    page.on('dialog', (dialog) => {
      void dialog.dismiss();
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from '@playwright/test';
