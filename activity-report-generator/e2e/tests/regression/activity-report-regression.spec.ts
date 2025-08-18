import { test, expect } from '@playwright/test';
import { ActivityReportPage } from '../../pages/activity-report.page';
import { testData } from '../../fixtures/test-data';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Activity Report Regression Tests', () => {
  let activityReportPage: ActivityReportPage;

  test.beforeEach(async ({ page }) => {
    activityReportPage = new ActivityReportPage(page);
    await activityReportPage.goto();
  });

  test('Report generation with all date range types', async ({ page }) => {
    const dateRanges = [
      TestHelpers.generateDateRange('current-month'),
      TestHelpers.generateDateRange('last-month'),
      TestHelpers.generateDateRange('current-quarter'),
    ];

    for (const dateRange of dateRanges) {
      await activityReportPage.fillReportCriteria({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        reportType: testData.reportTypes[0],
      });

      await activityReportPage.generateReport();

      // Verify report generation
      expect(await activityReportPage.isReportTableVisible()).toBe(true);

      // Clear form for next iteration
      await page.reload();
      await activityReportPage.verifyPageLoaded();
    }
  });

  test('Export functionality across different formats', async ({ page }) => {
    // Generate a report first
    await activityReportPage.fillReportCriteria(
      testData.reportCriteria.monthly
    );
    await activityReportPage.generateReport();

    // Test PDF export
    const pdfDownload = page.waitForEvent('download');
    await activityReportPage.exportReport('PDF');
    const pdfFile = await pdfDownload;
    expect(pdfFile.suggestedFilename()).toMatch(/\.pdf$/);

    // Test Excel export if available
    const excelDownload = page.waitForEvent('download');
    await activityReportPage.exportReport('Excel');
    const excelFile = await excelDownload;
    expect(excelFile.suggestedFilename()).toMatch(/\.(xlsx|xls)$/);
  });

  test('Form validation and error handling', async ({ page }) => {
    // Test invalid date ranges
    await activityReportPage.fillReportCriteria({
      startDate: '2025-01-31',
      endDate: '2025-01-01', // End date before start date
    });

    await activityReportPage.generateReport();

    // Check for error message
    const errorMessage = page.locator(
      '.error, .alert-danger, [data-testid="error"]'
    );
    await expect(errorMessage).toBeVisible();
  });

  test('Responsive design verification', async ({ page }) => {
    await TestHelpers.verifyResponseiveDesign(page);

    // Verify form is still functional on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await activityReportPage.fillReportCriteria(
      testData.reportCriteria.monthly
    );
    await activityReportPage.generateReport();

    expect(await activityReportPage.isReportTableVisible()).toBe(true);
  });

  test('Accessibility compliance', async ({ page }) => {
    await TestHelpers.verifyAccessibility(page);
  });
});
