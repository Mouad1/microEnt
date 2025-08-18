import { test, expect } from '@playwright/test';

// Advanced post-authentication tests with Auth0 service mocking
test.describe('Application Features with Bypassed Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Intercept Auth0 authentication requests and mock responses
    await page.route('**/auth0.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ authenticated: true })
      });
    });

    // Mock Auth0 authentication state globally
    await page.addInitScript(() => {
      const mockSubscription = { unsubscribe: () => {} };
      
      // Mock Auth0 SDK
      (window as any).auth0 = {
        isAuthenticated$: {
          subscribe: (callback: any) => {
            callback(true);
            return mockSubscription;
          }
        },
        user$: {
          subscribe: (callback: any) => {
            callback({
              sub: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              'https://myapp.com/roles': ['user']
            });
            return mockSubscription;
          }
        },
        getAccessTokenSilently: () => Promise.resolve('mock-token'),
        loginWithRedirect: () => Promise.resolve(),
        logout: () => Promise.resolve()
      };

      // Set authentication flags
      localStorage.setItem('auth0.authenticated', 'true');
      sessionStorage.setItem('auth0.authenticated', 'true');
      (window as any).mockAuthOverride = true;
    });

    console.log('🔐 Authentication mocking enabled');
  });

  test('dashboard displays actual content without auth redirect', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for Angular to load
    await page.waitForSelector('app-root', { timeout: 10000 });
    
    // Should see the actual dashboard, not auth redirect
    await expect(page.locator('app-dashboard')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Dashboard loaded successfully');
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'test-results/dashboard-authenticated.png',
      fullPage: true 
    });
  });

  test('activity report form is functional', async ({ page }) => {
    await page.goto('/activity-report');
    
    await page.waitForSelector('app-root', { timeout: 10000 });
    await expect(page.locator('app-activity-report')).toBeVisible({ timeout: 10000 });
    
    // Look for and test form elements
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    console.log(`Found ${formCount} forms on activity report page`);
    
    if (formCount > 0) {
      // Test first form
      const firstForm = forms.first();
      
      // Look for inputs in the form
      const inputs = firstForm.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      console.log(`Found ${inputCount} inputs in the form`);
      
      // Test date inputs specifically (common in activity reports)
      const dateInputs = firstForm.locator('input[type="date"]');
      const dateCount = await dateInputs.count();
      
      if (dateCount > 0) {
        console.log(`Testing ${dateCount} date inputs`);
        await dateInputs.first().fill('2025-01-01');
        
        if (dateCount > 1) {
          await dateInputs.nth(1).fill('2025-01-31');
        }
      }
      
      // Test text inputs
      const textInputs = firstForm.locator('input[type="text"], input:not([type])');
      const textCount = await textInputs.count();
      
      if (textCount > 0) {
        console.log(`Testing ${textCount} text inputs`);
        await textInputs.first().fill('Test Report Data');
      }
      
      // Test dropdowns
      const selects = firstForm.locator('select');
      const selectCount = await selects.count();
      
      if (selectCount > 0) {
        console.log(`Testing ${selectCount} dropdowns`);
        const options = selects.first().locator('option');
        const optionCount = await options.count();
        
        if (optionCount > 1) {
          await selects.first().selectOption({ index: 1 });
        }
      }
      
      // Look for and test submit/generate buttons
      const buttons = firstForm.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")');
      const buttonCount = await buttons.count();
      
      console.log(`Found ${buttonCount} action buttons`);
      
      if (buttonCount > 0) {
        console.log('✅ Activity report form is interactive');
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/activity-report-form.png',
      fullPage: true 
    });
  });

  test('navigation between authenticated pages works', async ({ page }) => {
    // Test navigation flow
    const pages = [
      { url: '/dashboard', component: 'app-dashboard' },
      { url: '/activity-report', component: 'app-activity-report' }
    ];
    
    for (const testPage of pages) {
      console.log(`Testing navigation to ${testPage.url}`);
      
      await page.goto(testPage.url);
      await page.waitForSelector('app-root', { timeout: 10000 });
      
      // Verify the correct component loads
      await expect(page.locator(testPage.component)).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ ${testPage.url} loaded successfully`);
    }
    
    // Test direct navigation between pages
    await page.goto('/dashboard');
    await expect(page.locator('app-dashboard')).toBeVisible();
    
    await page.goto('/activity-report');
    await expect(page.locator('app-activity-report')).toBeVisible();
    
    console.log('✅ Page navigation working correctly');
  });

  test('ui components render correctly after authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('app-root', { timeout: 10000 });
    
    // Check for common UI components
    const components = [
      'app-header',
      'app-dashboard', 
      'header',
      'nav',
      '.header',
      '.navigation'
    ];
    
    for (const component of components) {
      const elements = page.locator(component);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`✅ Found ${component} component`);
        await expect(elements.first()).toBeVisible();
      }
    }
    
    // Check for buttons, links, and interactive elements
    const interactiveElements = page.locator('button, a, input, select');
    const interactiveCount = await interactiveElements.count();
    
    console.log(`Found ${interactiveCount} interactive elements`);
    expect(interactiveCount).toBeGreaterThan(0);
  });
});
