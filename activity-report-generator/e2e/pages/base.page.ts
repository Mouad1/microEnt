import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('app-header');
    this.loadingSpinner = page.locator('.loading, [data-testid="loading"]');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    // Wait for Angular to load
    await this.page.waitForLoadState('networkidle');
    
    // Wait for loading spinner to disappear if present
    if (await this.loadingSpinner.isVisible()) {
      await this.loadingSpinner.waitFor({ state: 'hidden' });
    }
  }

  async isHeaderVisible() {
    return await this.header.isVisible();
  }

  async navigateTo(route: string) {
    const link = this.page.locator(`a[href="${route}"], [routerLink="${route}"]`);
    if (await link.count() > 0) {
      await link.click();
    } else {
      await this.page.goto(route);
    }
    await this.waitForPageLoad();
  }
}
