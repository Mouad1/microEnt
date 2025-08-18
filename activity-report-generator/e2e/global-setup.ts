import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Only run setup for local environment
  if (process.env.TEST_ENV !== 'local') {
    return;
  }

  console.log('🚀 Starting global setup...');

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for application to be ready
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:4200');

    // Perform any necessary setup (e.g., authentication, data seeding)
    console.log('✅ Application is ready for testing');

    // You can add authentication setup here
    // await setupAuthenticationCookies(page);
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed');
}

async function setupAuthenticationCookies(page: any) {
  // Example: Set up authentication cookies or tokens
  // This would be customized based on your Auth0 setup
  // If you have test users, you might login and store cookies
  // const cookies = await page.context().cookies();
  // await saveTestCookies(cookies);
}

export default globalSetup;
