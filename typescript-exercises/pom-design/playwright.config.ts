import { defineConfig, devices } from '@playwright/test';

/**
 * Minimal Playwright configuration for Demo:
 * - Simple screenshot on test failure only
 * - No traces, no videos
 * - Clean console list reporter
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'https://rahulshettyacademy.com/seleniumPractise/#/',
    headless: true,
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});