import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { ENV } from './src/config/env';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
     headless: false,
  launchOptions: {
    slowMo: 1000,
  },
    baseURL: ENV.BASE_URL,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  webServer: {
    command: 'npm run start',
    url: ENV.BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
