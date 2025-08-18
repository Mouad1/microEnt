import { test, expect } from '@playwright/test';

test.describe('Basic Connectivity Test', () => {
  test('can connect to Angular application', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');

    // Just verify the page loads and we can find the root element
    await expect(page.locator('body')).toBeVisible();

    // Check if we get any content (basic smoke test)
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();

    console.log('✅ Successfully connected to Angular app');
  });
});
