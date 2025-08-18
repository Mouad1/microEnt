import { defineConfig, devices } from '@playwright/test';

// Enterprise-grade configuration for different environments
const getEnterpriseConfig = () => {
  const env = process.env.TEST_ENV || 'local';

  const configs = {
    // Local Development - Mocked Auth
    local: {
      baseURL: 'http://localhost:4200',
      webServer: {
        command: 'npm start',
        url: 'http://localhost:4200',
        reuseExistingServer: true,
      },
      use: {
        // Fast execution for development
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
      projects: [
        {
          name: 'local-chrome',
          use: { browserName: 'chromium' },
          testMatch: '**/smoke/**/*.spec.ts', // Only smoke tests locally
        },
      ],
    },

    // Test Environment - Real Auth with Test Users
    test: {
      baseURL: 'https://test.activity-report-generator.com',
      use: {
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // Test environment credentials
        storageState: 'auth-state.json', // Pre-authenticated state
      },
      projects: [
        {
          name: 'test-regression',
          use: { browserName: 'chromium' },
          testMatch: '**/tests/**/*.spec.ts',
        },
      ],
    },

    // Staging Environment - Production-like
    staging: {
      baseURL: 'https://staging.activity-report-generator.com',
      use: {
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // Longer timeouts for staging
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
      projects: [
        {
          name: 'staging-e2e',
          use: { browserName: 'chromium' },
          testMatch: '**/tests/enterprise/**/*.spec.ts',
        },
        {
          name: 'staging-cross-browser',
          use: { browserName: 'firefox' },
          testMatch: '**/smoke/**/*.spec.ts',
        },
      ],
    },

    // CI/CD Pipeline
    ci: {
      baseURL:
        process.env.BASE_URL || 'https://test.activity-report-generator.com',
      use: {
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
      // Parallel execution in CI
      workers: process.env.CI ? 4 : 2,
      retries: 2,
      projects: [
        // Authentication setup
        {
          name: 'setup',
          testMatch: '**/auth-setup.ts',
        },
        // Main test suites
        {
          name: 'smoke-tests',
          use: { browserName: 'chromium' },
          testMatch: '**/smoke/**/*.spec.ts',
          dependencies: ['setup'],
        },
        {
          name: 'regression-tests',
          use: { browserName: 'chromium' },
          testMatch: '**/regression/**/*.spec.ts',
          dependencies: ['setup'],
        },
        {
          name: 'enterprise-tests',
          use: { browserName: 'chromium' },
          testMatch: '**/enterprise/**/*.spec.ts',
          dependencies: ['setup'],
        },
      ],
    },
  };

  return configs[env as keyof typeof configs] || configs.local;
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  // Reporter configuration for enterprise
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line'],
    // Enterprise reporting
    ...(process.env.CI
      ? [
          ['github'] as const,
          ['./custom-enterprise-reporter.js', {}] as const, // Custom enterprise reporter
        ]
      : []),
  ],

  // Global test configuration
  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  // Apply environment-specific configuration
  ...getEnterpriseConfig(),
});
