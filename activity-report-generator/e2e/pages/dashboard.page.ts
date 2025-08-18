import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly statsCards: Locator;
  readonly activitySummary: Locator;
  readonly quickActions: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, [data-testid="page-title"]');
    this.statsCards = page.locator('[data-testid="stats-card"], .stats-card');
    this.activitySummary = page.locator('[data-testid="activity-summary"]');
    this.quickActions = page.locator('[data-testid="quick-actions"]');
  }

  async goto() {
    await super.goto('/dashboard');
  }

  async verifyPageLoaded() {
    await expect(this.page.locator('app-dashboard')).toBeVisible();
    await expect(this.pageTitle).toBeVisible();
  }

  async getStatsCardsCount() {
    return await this.statsCards.count();
  }

  async isActivitySummaryVisible() {
    return await this.activitySummary.isVisible();
  }

  async clickQuickAction(actionName: string) {
    const action = this.quickActions.locator(
      `button:has-text("${actionName}"), a:has-text("${actionName}")`
    );
    await action.click();
  }
}
