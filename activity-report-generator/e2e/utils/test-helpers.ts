import { Page, expect } from '@playwright/test';

export class TestHelpers {
  static async waitForAngularToLoad(page: Page) {
    // Wait for Angular to be ready
    await page.waitForFunction(() => {
      return (window as any).ng?.probe && (window as any).getAllAngularTestabilities;
    });
    
    // Wait for Angular to be stable
    await page.waitForFunction(() => {
      const testabilities = (window as any).getAllAngularTestabilities();
      return testabilities.every((testability: any) => testability.isStable());
    });
  }

  static async mockApiResponse(page: Page, endpoint: string, response: any) {
    await page.route(`**/${endpoint}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async takeScreenshotOnFailure(page: Page, testName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `failure-${testName}-${timestamp}.png`;
    await page.screenshot({ path: `test-results/${filename}`, fullPage: true });
  }

  static async verifyAccessibility(page: Page) {
    // Check for proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      expect(ariaLabel || text).toBeTruthy();
    }

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  }

  static async verifyResponseiveDesign(page: Page) {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Allow layout to settle
      
      // Verify main content is still visible
      await expect(page.locator('app-root')).toBeVisible();
    }
  }

  static generateDateRange(type: 'current-month' | 'last-month' | 'current-quarter') {
    const now = new Date();
    
    switch (type) {
      case 'current-month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
          endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        };
      
      case 'last-month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
          endDate: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
        };
      
      case 'current-quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        return {
          startDate: new Date(now.getFullYear(), quarter * 3, 1).toISOString().split('T')[0],
          endDate: new Date(now.getFullYear(), quarter * 3 + 3, 0).toISOString().split('T')[0]
        };
      }
    }
  }
}
