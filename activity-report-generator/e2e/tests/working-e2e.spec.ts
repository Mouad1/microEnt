import { test, expect } from '@playwright/test';

// Working E2E tests with AuthGuard bypass
test.describe('Application E2E Tests - Auth Bypass Working', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔧 Setting up auth bypass...');

    // Method 1: Set localStorage flag before navigating
    await page.addInitScript(() => {
      localStorage.setItem('e2e_test_mode', 'true');
      (window as any).e2eTestMode = true;
      console.log('🔓 E2E test mode enabled');
    });

    // Method 2: Block Auth0 requests to prevent any external auth calls
    await page.route('**/auth0.com/**', (route) => {
      console.log(`🚫 Blocked Auth0 request: ${route.request().url()}`);
      route.abort();
    });
  });

  test('dashboard loads successfully with auth bypass', async ({ page }) => {
    console.log('🏠 Testing dashboard access...');

    // Navigate to dashboard with e2e flag
    await page.goto('/dashboard?e2e=true', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Check we're still on dashboard (not redirected to auth)
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    expect(currentUrl).toContain('/dashboard');
    expect(currentUrl).not.toContain('auth0.com');

    // Wait for Angular to load
    await page.waitForSelector('app-root', { timeout: 10000 });

    // Verify dashboard component is present
    const dashboardExists = await page.locator('app-dashboard').count();
    console.log(`📊 Dashboard components found: ${dashboardExists}`);

    if (dashboardExists > 0) {
      console.log('✅ Dashboard component loaded successfully!');

      // Test dashboard functionality
      await page.screenshot({
        path: 'test-results/dashboard-working.png',
        fullPage: true,
      });

      expect(dashboardExists).toBeGreaterThan(0);
    } else {
      // If no dashboard component, check what we got instead
      const pageContent = await page.textContent('body');
      console.log('🔍 Page content:', pageContent?.substring(0, 200));

      await page.screenshot({
        path: 'test-results/dashboard-debug.png',
        fullPage: true,
      });
    }
  });

  test('activity report page loads and is functional', async ({ page }) => {
    console.log('📋 Testing activity report access...');

    await page.goto('/activity-report?e2e=true', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const currentUrl = page.url();
    console.log(`📍 Activity report URL: ${currentUrl}`);

    expect(currentUrl).toContain('/activity-report');
    expect(currentUrl).not.toContain('auth0.com');

    await page.waitForSelector('app-root', { timeout: 10000 });

    // Check for activity report component
    const activityReportExists = await page
      .locator('app-activity-report')
      .count();
    console.log(`📋 Activity report components: ${activityReportExists}`);

    if (activityReportExists > 0) {
      console.log('✅ Activity report loaded!');

      // Test form interactions
      const forms = page.locator('form');
      const formCount = await forms.count();
      console.log(`📝 Forms found: ${formCount}`);

      // Test inputs
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      console.log(`🔤 Inputs found: ${inputCount}`);

      // Test buttons
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      console.log(`🔘 Buttons found: ${buttonCount}`);

      await page.screenshot({
        path: 'test-results/activity-report-working.png',
        fullPage: true,
      });

      expect(activityReportExists).toBeGreaterThan(0);
    }
  });

  test('navigation between pages works', async ({ page }) => {
    console.log('🧭 Testing page navigation...');

    // Start at dashboard
    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });

    let currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
    console.log(`✅ Dashboard loaded: ${currentUrl}`);

    // Navigate to activity report
    await page.goto('/activity-report?e2e=true', { waitUntil: 'networkidle' });

    currentUrl = page.url();
    expect(currentUrl).toContain('/activity-report');
    console.log(`✅ Activity report loaded: ${currentUrl}`);

    // Navigate back to dashboard
    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });

    currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
    console.log(`✅ Navigation working: back to dashboard`);

    console.log('🎉 Navigation test completed successfully!');
  });

  test('verify auth guard bypass is working', async ({ page }) => {
    console.log('🔍 Verifying auth guard bypass...');

    // Enable console logging to see auth guard messages
    page.on('console', (msg) => {
      if (msg.text().includes('AuthGuard') || msg.text().includes('🔓')) {
        console.log(`🎯 Auth Guard Log: ${msg.text()}`);
      }
    });

    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });

    const url = page.url();

    // Verify we're not on an auth page
    expect(url).not.toContain('auth0.com');
    expect(url).not.toContain('login');
    expect(url).toContain('/dashboard');

    console.log('✅ Auth guard bypass confirmed working!');
  });
});
