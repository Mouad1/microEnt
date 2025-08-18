import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';
import { ActivityReportPage } from '../../pages/activity-report.page';

test.describe('Report Generation Business Flow', () => {
  test('User can generate monthly activity report', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const activityReportPage = new ActivityReportPage(page);

    // Step 1: Navigate to dashboard
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();

    // Step 2: Navigate to activity report
    await dashboardPage.navigateTo('/activity-report');
    await activityReportPage.verifyPageLoaded();

    // Step 3: Fill report criteria
    await activityReportPage.fillReportCriteria({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      department: 'Engineering',
      reportType: 'Monthly Summary'
    });

    // Step 4: Generate report
    await activityReportPage.generateReport();

    // Step 5: Verify report is generated
    await expect(activityReportPage.isReportTableVisible()).resolves.toBe(true);
    
    // Step 6: Verify report has data
    const rowsCount = await activityReportPage.getReportRowsCount();
    expect(rowsCount).toBeGreaterThan(0);
  });

  test('User can export generated report as PDF', async ({ page }) => {
    const activityReportPage = new ActivityReportPage(page);

    // Pre-requisite: Generate a report first
    await activityReportPage.goto();
    await activityReportPage.fillReportCriteria({
      startDate: '2025-01-01',
      endDate: '2025-01-31'
    });
    await activityReportPage.generateReport();

    // Start download monitoring
    const downloadPromise = page.waitForEvent('download');
    
    // Export the report
    await activityReportPage.exportReport('PDF');
    
    // Verify download starts
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
