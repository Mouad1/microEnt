import { defineConfig, devices } from '@playwright/test';

/**
 * Local development configuration - optimized for speed and developer experience
 */
export default defineConfig({
  testDir: './e2e',
  
  // Faster execution for local development
  fullyParallel: true,
  workers: 4, // Use multiple workers for speed
  
  // Fail fast for quick feedback
  forbidOnly: false, // Allow .only for focused testing
  
  // Shorter timeouts for local testing
  timeout: 15000,
  expect: { timeout: 3000 },
  
  use: {
    // Local development server
    baseURL: 'http://localhost:4200',
    
    // Faster settings for local dev
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Shorter timeouts
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },

  projects: [
    // Local smoke tests - fastest feedback
    {
      name: 'local-smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/smoke/local-development.spec.ts',
        '**/basic-test.spec.ts',
        '**/example.spec.ts'
      ],
    },
    
    // Optional: Component-level tests with mocked auth
    {
      name: 'local-components',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/tests/business-flows/**/*.spec.ts',
      // These tests will use mock authentication
    },
  ],

  // Auto-start local server
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true, // Don't restart if already running
    timeout: 60 * 1000, // 1 minute timeout
  },

  // Simple reporter for local development
  reporter: [
    ['line'], // Simple console output
    ['html', { outputFolder: 'test-results/local-report', open: 'never' }]
  ],

  // Output directories
  outputDir: 'test-results/local-artifacts',
});
