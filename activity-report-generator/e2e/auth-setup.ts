// Enterprise-grade authentication setup for CI/CD
import { test as setup, expect } from '@playwright/test';
import { AuthHelper } from './utils/auth-helper';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Check if we should use real authentication or mock
  const useRealAuth = process.env.USE_REAL_AUTH === 'true';
  
  if (useRealAuth) {
    // Real authentication for staging/production testing
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;
    
    if (!testEmail || !testPassword) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for real authentication');
    }
    
    const auth = new AuthHelper(page);
    
    // Go to the app (will redirect to Auth0)
    await page.goto('/dashboard');
    
    // Fill the login form
    await auth.fillLoginForm(testEmail, testPassword);
    
    // Verify successful authentication
    await expect(page.locator('app-dashboard')).toBeVisible();
    
    console.log('✅ Real authentication successful');
  } else {
    // Mock authentication for faster test execution
    const auth = new AuthHelper(page);
    await auth.mockAuthentication('user');
    
    // Verify mock authentication works
    await page.goto('/dashboard');
    await expect(page.locator('app-dashboard')).toBeVisible();
    
    console.log('✅ Mock authentication successful');
  }
  
  // Save authenticated state
  await page.context().storageState({ path: authFile });
});

// Admin authentication setup
setup('authenticate as admin', async ({ page }) => {
  const authFile = 'playwright/.auth/admin.json';
  
  const auth = new AuthHelper(page);
  await auth.mockAuthentication('admin');
  
  await page.goto('/configuration');
  await expect(page.locator('app-configuration')).toBeVisible();
  
  await page.context().storageState({ path: authFile });
  console.log('✅ Admin authentication successful');
});
