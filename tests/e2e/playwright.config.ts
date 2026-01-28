import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const storage = path.resolve(__dirname, 'state.json');

export default defineConfig({
  testDir: path.resolve(__dirname, 'tests'),
  timeout: 30_000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { outputFolder: 'tests/e2e/playwright-report' }]],
  use: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    storageState: storage,
  },
  globalSetup: path.resolve(__dirname, 'global-setup.js'),
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
