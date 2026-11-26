import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:4400', trace: 'off' },
  webServer: {
    command: 'npm run build && npm run build:fixture && node tests/serve.mjs',
    url: 'http://127.0.0.1:4401/kk/',
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
