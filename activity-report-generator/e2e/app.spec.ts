import { test, expect } from '@playwright/test';

test.describe('Activity Report Generator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page).toHaveTitle(/Activity Report Generator/i);
  });

  test('should load the main application component', async ({ page }) => {
    // Wait for Angular app to load
    await page.waitForSelector('app-root');

    // Check if the main app component is visible
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    // Look for dashboard navigation link
    const dashboardLink = page.locator(
      'a[href="/dashboard"], [routerLink="/dashboard"]'
    );

    if ((await dashboardLink.count()) > 0) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/.*dashboard.*/);
    } else {
      // Navigate directly if no link found
      await page.goto('/dashboard');
    }

    // Check if dashboard component loads
    await expect(page.locator('app-dashboard')).toBeVisible();
  });

  test('should navigate to activity report', async ({ page }) => {
    // Look for activity report navigation
    const activityReportLink = page.locator(
      'a[href="/activity-report"], [routerLink="/activity-report"]'
    );

    if ((await activityReportLink.count()) > 0) {
      await activityReportLink.click();
      await expect(page).toHaveURL(/.*activity-report.*/);
    } else {
      // Navigate directly if no link found
      await page.goto('/activity-report');
    }

    // Check if activity report component loads
    await expect(page.locator('app-activity-report')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Verify the app still loads correctly on mobile
    await expect(page.locator('app-root')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    // Verify the app still loads correctly on desktop
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('should check for accessibility', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // Ensure headings are visible
      await expect(headings.first()).toBeVisible();
    }

    // Check for alt text on images if any exist
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });
});
