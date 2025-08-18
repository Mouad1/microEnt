import { test, expect } from '@playwright/test';

// Working authentication bypass tests
test.describe('Application Features - Working Auth Bypass', () => {
  
  test.beforeEach(async ({ page }) => {
    // Block all Auth0 network requests to prevent redirects
    await page.route('**/auth0.com/**', route => route.abort());
    await page.route('**/auth/**', route => route.abort());
    await page.route('**/login**', route => route.abort());
    
    // Inject authentication bypass before any Angular code runs
    await page.addInitScript(() => {
      // Override Auth0 SDK completely
      (window as any).Auth0Client = class {
        isAuthenticated() { return Promise.resolve(true); }
        getUser() { 
          return Promise.resolve({
            sub: 'test-user-123',
            name: 'Test User',
            email: 'test@example.com'
          }); 
        }
        getAccessTokenSilently() { return Promise.resolve('mock-token'); }
        loginWithRedirect() { return Promise.resolve(); }
        logout() { return Promise.resolve(); }
      };

      // Mock Auth0 Angular SDK
      (window as any).AuthService = {
        isAuthenticated$: {
          pipe: () => ({ subscribe: (cb: any) => cb(true) }),
          subscribe: (cb: any) => cb(true)
        },
        user$: {
          pipe: () => ({ subscribe: (cb: any) => cb({ name: 'Test User' }) }),
          subscribe: (cb: any) => cb({ name: 'Test User' })
        }
      };

      // Set localStorage flags that Angular might check
      localStorage.setItem('auth0.is.authenticated', 'true');
      localStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('auth0.is.authenticated', 'true');
      
      // Mock common authentication checks
      (window as any).isAuthenticated = true;
      (window as any).mockAuth = true;
      
      console.log('🔐 Authentication fully bypassed');
    });

    // Additional route blocking for login redirects
    await page.route('**/login', route => {
      console.log('🚫 Blocked login redirect');
      route.fulfill({ status: 200, body: 'blocked' });
    });
  });

  test('dashboard loads without auth redirect', async ({ page }) => {
    console.log('🔍 Testing dashboard access...');
    
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    
    // Check if we're still on dashboard and not redirected
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    expect(currentUrl).toContain('/dashboard');
    expect(currentUrl).not.toContain('login');
    expect(currentUrl).not.toContain('auth');
    
    // Wait for Angular to load
    await page.waitForSelector('app-root', { timeout: 15000 });
    
    // Check page content
    const bodyText = await page.textContent('body');
    console.log('Page contains login?', bodyText?.includes('login') || bodyText?.includes('Login'));
    console.log('Page contains dashboard?', bodyText?.includes('dashboard') || bodyText?.includes('Dashboard'));
    
    // Take screenshot to see what's actually loaded
    await page.screenshot({ 
      path: 'test-results/dashboard-bypass-test.png',
      fullPage: true 
    });
    
    console.log('✅ Dashboard test completed');
  });

  test('activity report page loads without auth redirect', async ({ page }) => {
    console.log('🔍 Testing activity report access...');
    
    await page.goto('/activity-report', { waitUntil: 'networkidle' });
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    expect(currentUrl).toContain('/activity-report');
    expect(currentUrl).not.toContain('login');
    
    await page.waitForSelector('app-root', { timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/activity-report-bypass-test.png',
      fullPage: true 
    });
    
    console.log('✅ Activity report test completed');
  });

  test('home page loads without auth redirect', async ({ page }) => {
    console.log('🔍 Testing home page access...');
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    expect(currentUrl).not.toContain('login');
    expect(currentUrl).not.toContain('auth');
    
    await page.waitForSelector('app-root', { timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/home-bypass-test.png',
      fullPage: true 
    });
    
    console.log('✅ Home page test completed');
  });

  test('check what auth guards are doing', async ({ page }) => {
    console.log('🔍 Investigating auth guard behavior...');
    
    // Listen to console logs to see what's happening
    page.on('console', msg => {
      console.log(`🔊 Browser console: ${msg.text()}`);
    });
    
    // Listen to all network requests
    page.on('request', request => {
      const url = request.url();
      if (url.includes('auth') || url.includes('login')) {
        console.log(`🌐 Network request: ${url}`);
      }
    });
    
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    
    const currentUrl = page.url();
    console.log(`Final URL: ${currentUrl}`);
    
    // Get page content to analyze
    const content = await page.content();
    const hasLogin = content.includes('login') || content.includes('Login');
    const hasDashboard = content.includes('dashboard') || content.includes('Dashboard');
    
    console.log(`Page has login content: ${hasLogin}`);
    console.log(`Page has dashboard content: ${hasDashboard}`);
    
    // Take detailed screenshot
    await page.screenshot({ 
      path: 'test-results/auth-guard-investigation.png',
      fullPage: true 
    });
  });
});
