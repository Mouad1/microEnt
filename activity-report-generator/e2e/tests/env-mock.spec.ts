import { test } from '@playwright/test';

// The most effective approach: Mock at environment level
test.describe('E2E Tests - Environment Mock Approach', () => {
  
  test.beforeEach(async ({ page }) => {
    // Intercept the environment file and replace with test config
    await page.route('**/environments/environment.js', async route => {
      const testEnv = `
        export const environment = {
          production: false,
          testing: true,
          auth0: {
            domain: 'test.auth0.com',
            clientId: 'test-client',
            redirectUri: '${page.url()}',
            audience: undefined
          }
        };
      `;
      
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: testEnv
      });
    });

    // Mock all Auth0 network calls
    await page.route('**/test.auth0.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ authenticated: true, user: { name: 'Test User' } })
      });
    });

    // Intercept auth redirects completely
    await page.route('**/authorize**', route => {
      console.log('🚫 Blocked auth redirect');
      route.fulfill({ status: 200, body: 'blocked' });
    });
  });

  test('basic app loading test', async ({ page }) => {
    console.log('🔍 Testing basic app loading...');
    
    await page.goto('/', { timeout: 30000 });
    
    const url = page.url();
    console.log(`Final URL: ${url}`);
    
    await page.screenshot({ 
      path: 'test-results/basic-app-load.png', 
      fullPage: true 
    });
    
    // Simple check - are we on an auth page or app page?
    const content = await page.content();
    const isAuthPage = content.includes('auth0') || 
                      content.includes('login') || 
                      content.includes('authorize');
    
    console.log(`Is auth page: ${isAuthPage}`);
    console.log(`Has app-root: ${content.includes('app-root')}`);
    
    if (isAuthPage) {
      console.log('❌ Still redirected to auth');
    } else {
      console.log('✅ App loaded without auth redirect');
    }
  });
});
