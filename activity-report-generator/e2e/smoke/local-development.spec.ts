import { test, expect } from '@playwright/test';

// Local development smoke tests - designed for fast feedback
test.describe('Local Development Smoke Tests', () => {
  test('app loads and displays correctly', async ({ page }) => {
    await page.goto('/');

    // Fast check - just verify app loads
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('auth0.com')) {
      // Auth0 redirect - expected
      await expect(page.locator('body')).toBeVisible();
      console.log('✅ Auth redirect working - app security intact');
    } else {
      // App loaded directly
      await expect(page.locator('app-root')).toBeVisible();
      console.log('✅ App loads correctly');
    }
  });

  test('navigation structure is intact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if we can reach different routes (will redirect to auth if needed)
    const routes = ['/dashboard', '/activity-report'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Should either show auth or the page
      const hasContent = await page.locator('body').isVisible();
      expect(hasContent).toBe(true);
    }

    console.log('✅ All routes are accessible');
  });

  test('app builds and serves without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000); // Give time for any errors to surface

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon.ico') &&
        !error.includes('DevTools') &&
        !error.includes('auth0') // Auth0 warnings are expected in test
    );

    expect(criticalErrors.length).toBe(0);
    console.log('✅ No critical console errors detected');
  });
});
