import { test, expect } from '@playwright/test';

// Simple approach: Test with auth guard temporarily disabled
test.describe('E2E Tests with Auth Guard Bypass', () => {
  
  test.beforeEach(async ({ page }) => {
    // Simple approach: Replace the auth guard behavior entirely
    await page.addInitScript(() => {
      // Override the auth guard at the Angular level
      (window as any).authGuardOverride = {
        canActivate: () => true,
        isAuthenticated: true
      };
      
      console.log('🔓 Auth guard override installed');
    });
    
    // Block external auth requests
    await page.route('**/auth0.com/**', route => route.abort());
    await page.route('**/login', route => route.abort());
  });

  test('navigate to dashboard and check actual content', async ({ page }) => {
    console.log('🔍 Testing dashboard navigation...');
    
    // Go to dashboard
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForSelector('app-root', { timeout: 10000 });
    
    // Get current URL
    const url = page.url();
    console.log(`Current URL: ${url}`);
    
    // Take screenshot to see what we got
    await page.screenshot({ path: 'test-results/dashboard-test.png', fullPage: true });
    
    // Get page content for analysis
    const pageText = await page.textContent('body');
    const hasLogin = pageText?.includes('login') || pageText?.includes('Login');
    const hasDashboard = pageText?.includes('dashboard') || pageText?.includes('Dashboard');
    
    console.log(`Page contains login: ${hasLogin}`);
    console.log(`Page contains dashboard: ${hasDashboard}`);
    console.log(`URL contains auth: ${url.includes('auth')}`);
    
    // If we're still getting redirected, let's see the actual HTML
    if (url.includes('auth') || hasLogin) {
      console.log('❌ Still being redirected to auth');
      const html = await page.content();
      console.log('HTML preview:', html.substring(0, 500));
    } else {
      console.log('✅ Successfully bypassed auth');
    }
  });

  test('check what happens with a simple GET request to app routes', async ({ page }) => {
    console.log('🔍 Testing simple route access...');
    
    // Try the simplest possible test
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log(`Response status: ${response?.status()}`);
    console.log(`Final URL: ${page.url()}`);
    
    await page.screenshot({ path: 'test-results/home-page-test.png', fullPage: true });
    
    // Check if Angular is even loading
    const angularPresent = await page.evaluate(() => {
      return document.querySelector('app-root') !== null;
    });
    
    console.log(`Angular app-root present: ${angularPresent}`);
  });
});
