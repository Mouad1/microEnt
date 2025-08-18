import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ActivityReportPage extends BasePage {
  readonly pageTitle: Locator;
  readonly reportForm: Locator;
  readonly generateButton: Locator;
  readonly exportButton: Locator;
  readonly reportTable: Locator;
  readonly filterSection: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, [data-testid="page-title"]');
    this.reportForm = page.locator('form, [data-testid="report-form"]');
    this.generateButton = page.locator('button:has-text("Generate"), [data-testid="generate-btn"]');
    this.exportButton = page.locator('button:has-text("Export"), [data-testid="export-btn"]');
    this.reportTable = page.locator('table, [data-testid="report-table"]');
    this.filterSection = page.locator('[data-testid="filters"]');
  }

  async goto() {
    await super.goto('/activity-report');
  }

  async verifyPageLoaded() {
    await expect(this.page.locator('app-activity-report')).toBeVisible();
    await expect(this.pageTitle).toBeVisible();
  }

  async fillReportCriteria(criteria: {
    startDate?: string;
    endDate?: string;
    department?: string;
    reportType?: string;
  }) {
    if (criteria.startDate) {
      await this.page.fill('[data-testid="start-date"], input[name="startDate"]', criteria.startDate);
    }
    
    if (criteria.endDate) {
      await this.page.fill('[data-testid="end-date"], input[name="endDate"]', criteria.endDate);
    }

    if (criteria.department) {
      await this.page.selectOption('[data-testid="department"], select[name="department"]', criteria.department);
    }

    if (criteria.reportType) {
      await this.page.selectOption('[data-testid="report-type"], select[name="reportType"]', criteria.reportType);
    }
  }

  async generateReport() {
    await this.generateButton.click();
    await this.waitForPageLoad();
  }

  async exportReport(format: 'PDF' | 'Excel' = 'PDF') {
    // Look for export dropdown or direct button
    const exportDropdown = this.page.locator('[data-testid="export-dropdown"]');
    
    if (await exportDropdown.isVisible()) {
      await exportDropdown.click();
      await this.page.locator(`text=${format}`).click();
    } else {
      await this.exportButton.click();
    }
  }

  async isReportTableVisible() {
    return await this.reportTable.isVisible();
  }

  async getReportRowsCount() {
    const rows = this.reportTable.locator('tbody tr');
    return await rows.count();
  }
}
