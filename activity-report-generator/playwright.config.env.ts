import { defineConfig, devices } from '@playwright/test';

const environments = {
  local: {
    baseURL: 'http://localhost:4200',
    webServer: {
      command: 'npm start',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
    },
  },
  staging: {
    baseURL: 'https://staging.activity-report-generator.com',
  },
  production: {
    baseURL: 'https://activity-report-generator.com',
  },
};

const currentEnv = process.env.TEST_ENV || 'local';
const envConfig = environments[currentEnv as keyof typeof environments];

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Global test timeout
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    // Smoke tests - run on all browsers
    {
      name: 'smoke-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/smoke/**/*.spec.ts',
    },
    {
      name: 'smoke-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/smoke/**/*.spec.ts',
    },

    // Business flow tests - primary browser only
    {
      name: 'business-flows',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/business-flows/**/*.spec.ts',
      dependencies: ['smoke-chromium'],
    },

    // Regression tests - comprehensive browser coverage
    {
      name: 'regression-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/regression/**/*.spec.ts',
    },
    {
      name: 'regression-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/regression/**/*.spec.ts',
    },
    {
      name: 'regression-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/regression/**/*.spec.ts',
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/smoke/**/*.spec.ts',
    },
  ],

  webServer: currentEnv === 'local' ? environments.local.webServer : undefined,

  // Global setup and teardown
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
});
