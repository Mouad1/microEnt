import { test, expect } from '@playwright/test';
import { AuthHelper } from '../../utils/auth-helper';

// Enterprise Pattern: Test different authentication scenarios
test.describe('Enterprise Authentication Testing', () => {
  
  // Tier 1: Authentication Flow Testing (Critical)
  test.describe('Authentication Flow', () => {
    test('login redirect works correctly', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Verify redirect to Auth0
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toContain('auth0.com');
      
      // Verify login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('unauthorized access is blocked', async ({ page }) => {
      // Try to access protected routes without auth
      const protectedRoutes = ['/dashboard', '/activity-report', '/configuration'];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        
        // Should be redirected to Auth0
        expect(page.url()).toContain('auth0.com');
      }
    });
  });

  // Tier 2: Business Logic Testing (with mocked auth)
  test.describe('Business Logic with Mock Auth', () => {
    test('user role can access basic features', async ({ page }) => {
      const auth = new AuthHelper(page);
      await auth.mockAuthentication('user');
      
      await page.goto('/dashboard');
      await expect(page.locator('app-dashboard')).toBeVisible();
      
      await page.goto('/activity-report');
      await expect(page.locator('app-activity-report')).toBeVisible();
    });

    test('admin role can access admin features', async ({ page }) => {
      const auth = new AuthHelper(page);
      await auth.mockAuthentication('admin');
      
      await page.goto('/configuration');
      await expect(page.locator('app-configuration')).toBeVisible();
      
      await page.goto('/documentation');
      await expect(page.locator('app-documentation-viewer')).toBeVisible();
    });

    test('user role cannot access admin features', async ({ page }) => {
      const auth = new AuthHelper(page);
      await auth.mockAuthentication('user');
      
      await page.goto('/configuration');
      // Should be redirected to unauthorized page
      await expect(page.locator('app-unauthorized')).toBeVisible();
    });
  });

  // Tier 3: End-to-End Integration (Real Auth - CI/CD only)
  test.describe('Full Integration Tests', () => {
    test.skip(!process.env.CI, 'Integration tests run only in CI/CD');
    
    test('complete user journey with real auth', async ({ page }) => {
      // Use test credentials from secure environment variables
      const testEmail = process.env.TEST_USER_EMAIL!;
      const testPassword = process.env.TEST_USER_PASSWORD!;
      
      const auth = new AuthHelper(page);
      
      await page.goto('/dashboard');
      await auth.fillLoginForm(testEmail, testPassword);
      
      // Verify successful login
      await expect(page.locator('app-dashboard')).toBeVisible();
      
      // Test complete workflow
      await page.goto('/activity-report');
      // ... test complete business flow
    });
  });
});
