import { test } from '@playwright/test';

// Ultimate solution: Test specific pages that don't require auth
test.describe('E2E Tests - Test Accessible Routes', () => {
  
  test('test unauthorized page (should be accessible)', async ({ page }) => {
    console.log('🔍 Testing unauthorized page access...');
    
    await page.goto('/unauthorized', { timeout: 30000 });
    
    const url = page.url();
    console.log(`URL: ${url}`);
    
    // This page should load without auth
    await page.waitForSelector('app-root', { timeout: 10000 });
    
    await page.screenshot({ 
      path: 'test-results/unauthorized-page.png', 
      fullPage: true 
    });
    
    // Check content
    const content = await page.textContent('body');
    console.log(`Page content includes 'unauthorized': ${content?.includes('unauthorized')}`);
    console.log(`URL redirected to auth: ${url.includes('auth')}`);
  });

  test('test 404 redirect behavior', async ({ page }) => {
    console.log('🔍 Testing 404 behavior...');
    
    await page.goto('/nonexistent-route', { timeout: 30000 });
    
    const url = page.url();
    console.log(`404 redirected to: ${url}`);
    
    await page.screenshot({ 
      path: 'test-results/404-redirect.png', 
      fullPage: true 
    });
  });

  test('analyze the auth redirect behavior', async ({ page }) => {
    console.log('🔍 Analyzing auth redirect behavior...');
    
    // Track all navigation events
    page.on('framenavigated', frame => {
      console.log(`🧭 Navigation: ${frame.url()}`);
    });
    
    // Track network requests
    page.on('request', request => {
      const url = request.url();
      if (url.includes('auth') || url.includes('login')) {
        console.log(`🌐 Auth request: ${url}`);
      }
    });
    
    // Try to go to dashboard and see exactly what happens
    await page.goto('/dashboard', { timeout: 30000 });
    
    // Wait to see where we end up
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log(`🎯 Final URL: ${finalUrl}`);
    
    await page.screenshot({ 
      path: 'test-results/auth-redirect-analysis.png', 
      fullPage: true 
    });
    
    // Get the page content to see what auth provider we're dealing with
    const content = await page.content();
    
    if (content.includes('auth0')) {
      console.log('🔍 Auth0 detected in page content');
    }
    
    if (finalUrl.includes('auth0.com')) {
      console.log('🔍 Redirected to Auth0 domain');
      console.log(`Auth0 URL: ${finalUrl}`);
    }
    
    console.log('Page title:', await page.title());
  });
});
