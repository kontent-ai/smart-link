import { test as base } from '@playwright/experimental-ct-react';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.goto(`${baseURL}/?kontent-smart-link-enabled`);
    await use(page);
  },
});
