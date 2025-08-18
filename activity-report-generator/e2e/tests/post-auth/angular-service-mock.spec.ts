import { test, expect } from '@playwright/test';

// Effective authentication bypass by mocking Angular Auth0 service
test.describe('Authentication Bypass - Angular Service Mock', () => {
  test.beforeEach(async ({ page }) => {
    // Block all Auth0 external requests
    await page.route('**/auth0.com/**', (route) => route.abort());
    await page.route('**/auth/**', (route) => route.abort());

    // Comprehensive Auth0 Angular service mock - must run before Angular loads
    await page.addInitScript(() => {
      // Mock the Auth0 Angular AuthService
      const mockAuthService = {
        isAuthenticated$: {
          pipe: (operatorFn?: any) => {
            const mockObservable = {
              subscribe: (observer: any) => {
                if (typeof observer === 'function') {
                  observer(true);
                } else {
                  observer.next(true);
                }
                return { unsubscribe: () => {} };
              },
            };
            return operatorFn ? operatorFn(mockObservable) : mockObservable;
          },
          subscribe: (observer: any) => {
            if (typeof observer === 'function') {
              observer(true);
            } else {
              observer.next(true);
            }
            return { unsubscribe: () => {} };
          },
        },
        user$: {
          pipe: (operatorFn?: any) => {
            const mockUser = { name: 'Test User', email: 'test@example.com' };
            const mockObservable = {
              subscribe: (observer: any) => {
                if (typeof observer === 'function') {
                  observer(mockUser);
                } else {
                  observer.next(mockUser);
                }
                return { unsubscribe: () => {} };
              },
            };
            return operatorFn ? operatorFn(mockObservable) : mockObservable;
          },
          subscribe: (observer: any) => {
            const mockUser = { name: 'Test User', email: 'test@example.com' };
            if (typeof observer === 'function') {
              observer(mockUser);
            } else {
              observer.next(mockUser);
            }
            return { unsubscribe: () => {} };
          },
        },
        getAccessTokenSilently: () => Promise.resolve('mock-access-token'),
        loginWithRedirect: () => {
          console.log(
            '🔐 loginWithRedirect called but mocked - not redirecting'
          );
          return Promise.resolve();
        },
        logout: () => Promise.resolve(),
      };

      // Store the mock service globally so Angular can use it
      (window as any).mockAuthService = mockAuthService;
      (window as any).authBypassEnabled = true;

      console.log('🔐 Auth0 Angular service fully mocked');
    });

    // Also intercept any login redirects at the browser level
    await page.route('**/login**', (route) => {
      console.log('🚫 Intercepted login redirect, staying on current page');
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Login intercepted by test</body></html>',
      });
    });
  });

  test('verify auth bypass is working by checking URL', async ({ page }) => {
    console.log('🔍 Testing if auth bypass prevents redirects...');

    // Enable console logging to see what happens
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        console.log(`📝 Browser: ${msg.text()}`);
      }
    });

    // Try to go to dashboard
    await page.goto('/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait a bit for any redirects to happen
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`🌐 Current URL after navigation: ${currentUrl}`);

    // Check if we stayed on dashboard or got redirected
    const isOnDashboard = currentUrl.includes('/dashboard');
    const wasRedirected =
      currentUrl.includes('login') ||
      currentUrl.includes('auth') ||
      currentUrl.includes('authorize');

    console.log(`📍 On dashboard: ${isOnDashboard}`);
    console.log(`🔄 Was redirected: ${wasRedirected}`);

    // Take screenshot of what we actually see
    await page.screenshot({
      path: 'test-results/auth-bypass-verification.png',
      fullPage: true,
    });

    // Get page title and content for analysis
    const title = await page.title();
    const bodyText = await page.textContent('body');

    console.log(`📄 Page title: ${title}`);
    console.log(
      `📄 Body contains 'dashboard': ${bodyText
        ?.toLowerCase()
        .includes('dashboard')}`
    );
    console.log(
      `📄 Body contains 'login': ${bodyText?.toLowerCase().includes('login')}`
    );

    // If we're still getting redirected, the test should show us where
    expect(currentUrl).not.toContain('auth');
    expect(currentUrl).not.toContain('login');
  });

  test('test activity report page access', async ({ page }) => {
    console.log('🔍 Testing activity report access...');

    await page.goto('/activity-report', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`🌐 Activity report URL: ${currentUrl}`);

    await page.screenshot({
      path: 'test-results/activity-report-access.png',
      fullPage: true,
    });

    expect(currentUrl).not.toContain('auth');
    expect(currentUrl).not.toContain('login');
  });

  test('inspect Angular app state', async ({ page }) => {
    console.log('🔍 Inspecting Angular application state...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check if Angular loaded
    const hasAngular = await page.evaluate(() => {
      return (
        typeof (window as any).ng !== 'undefined' ||
        document.querySelector('app-root') !== null
      );
    });

    console.log(`🅰️ Angular detected: ${hasAngular}`);

    // Check what components are present
    const appRoot = await page.locator('app-root').count();
    const dashboard = await page.locator('app-dashboard').count();

    console.log(`🏠 app-root components: ${appRoot}`);
    console.log(`📊 app-dashboard components: ${dashboard}`);

    // Check if our auth mock is present
    const authMockStatus = await page.evaluate(() => {
      return {
        mockPresent: !!(window as any).mockAuthService,
        bypassEnabled: !!(window as any).authBypassEnabled,
      };
    });

    console.log(`🔐 Auth mock status:`, authMockStatus);
  });
});
