import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';
import { ActivityReportPage } from '../../pages/activity-report.page';

test.describe('Smoke Tests - Critical Application Paths', () => {
  test('Application loads and main navigation works', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Verify app loads
    await page.goto('/');
    await expect(page.locator('app-root')).toBeVisible();

    // Verify header is present
    expect(await dashboardPage.isHeaderVisible()).toBe(true);

    // Verify dashboard is accessible
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();
  });

  test('Activity Report page loads without errors', async ({ page }) => {
    const activityReportPage = new ActivityReportPage(page);

    await activityReportPage.goto();
    await activityReportPage.verifyPageLoaded();
    
    // Verify essential elements are present
    await expect(activityReportPage.reportForm).toBeVisible();
    await expect(activityReportPage.generateButton).toBeVisible();
  });

  test('Authentication system is working', async ({ page }) => {
    // This test would be customized based on your Auth0 setup
    await page.goto('/');
    
    // Check if user is redirected to login or app loads
    await page.waitForLoadState('networkidle');
    
    // Verify either login form or authenticated content
    const isAuthenticated = await page.locator('app-dashboard, app-activity-report').isVisible();
    const isLoginPage = await page.locator('[data-testid="login"], .auth0-lock').isVisible();
    
    expect(isAuthenticated || isLoginPage).toBe(true);
  });
});
