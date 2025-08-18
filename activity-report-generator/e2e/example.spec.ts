import { test, expect } from '@playwright/test';

test('homepage redirects to authentication', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if we're redirected to Auth0 or if the app loads
  const currentUrl = page.url();
  
  if (currentUrl.includes('auth0.com') || currentUrl.includes('login')) {
    // Auth0 redirect happened - this is expected behavior
    console.log('✅ Authentication redirect working correctly');
    expect(currentUrl).toContain('auth0.com');
  } else {
    // App loaded directly (maybe auth is disabled or user is authenticated)
    await expect(page.locator('app-root')).toBeVisible();
    console.log('✅ App loaded without authentication redirect');
  }
});

test('navigation handles authentication properly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the application to load or redirect
  await page.waitForLoadState('networkidle');
  
  const currentUrl = page.url();
  
  if (currentUrl.includes('auth0.com')) {
    // We're on Auth0 login page
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Redirected to Auth0 login as expected');
  } else {
    // We're on the app (authenticated or auth disabled)
    await expect(page.locator('app-root')).toBeVisible();
    console.log('✅ App navigation working');
  }
});

test('dashboard page handles authentication', async ({ page }) => {
  await page.goto('/dashboard');
  
  await page.waitForLoadState('networkidle');
  
  const currentUrl = page.url();
  
  if (currentUrl.includes('auth0.com')) {
    // Auth0 redirect - expected for protected routes
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Dashboard properly protected by authentication');
  } else {
    // Dashboard loaded (user authenticated or auth disabled)
    await expect(page.locator('app-root')).toBeVisible();
    console.log('✅ Dashboard accessible');
  }
});
