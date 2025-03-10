import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: { '@/': new URL('./src/', import.meta.url).pathname },
    root: './test-browser',
    browser: {
      enabled: true,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
  },
});
