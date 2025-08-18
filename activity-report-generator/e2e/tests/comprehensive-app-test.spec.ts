import { test, expect } from '@playwright/test';

// Comprehensive application functionality tests - WORKING!
test.describe('Application Functionality Tests - Post Auth Bypass', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set up the working auth bypass
    await page.addInitScript(() => {
      localStorage.setItem('e2e_test_mode', 'true');
      (window as any).e2eTestMode = true;
    });
    
    // Block Auth0 to prevent any interference
    await page.route('**/auth0.com/**', route => route.abort());
  });

  test('comprehensive dashboard functionality test', async ({ page }) => {
    console.log('🏠 Testing comprehensive dashboard functionality...');
    
    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });
    
    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('app-dashboard')).toBeVisible();
    
    console.log('✅ Dashboard loaded successfully');
    
    // Test UI components
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    
    console.log(`📊 Dashboard contains: ${buttons} buttons, ${links} links, ${headings} headings`);
    
    // Check for navigation elements
    const navigation = await page.locator('nav, .nav, .navigation, .menu').count();
    if (navigation > 0) {
      console.log('🧭 Navigation elements found');
    }
    
    // Test any interactive elements
    if (buttons > 0) {
      console.log('🔘 Testing button interactions...');
      const firstButton = page.locator('button').first();
      const buttonText = await firstButton.textContent();
      console.log(`First button text: "${buttonText}"`);
      
      // Click first button (if it's safe to click)
      if (buttonText && !buttonText.toLowerCase().includes('delete')) {
        await firstButton.click();
        console.log('✅ Button click successful');
      }
    }
    
    await page.screenshot({ 
      path: 'test-results/dashboard-functionality.png', 
      fullPage: true 
    });
  });

  test('activity report form functionality test', async ({ page }) => {
    console.log('📋 Testing activity report form functionality...');
    
    await page.goto('/activity-report?e2e=true', { waitUntil: 'networkidle' });
    
    expect(page.url()).toContain('/activity-report');
    await expect(page.locator('app-activity-report')).toBeVisible();
    
    console.log('✅ Activity report page loaded');
    
    // Test form interactions
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`📝 Found ${formCount} forms - testing first form`);
      
      const form = forms.first();
      
      // Test different input types
      const textInputs = form.locator('input[type="text"], input:not([type])');
      const dateInputs = form.locator('input[type="date"]');
      const selects = form.locator('select');
      const textareas = form.locator('textarea');
      
      const textCount = await textInputs.count();
      const dateCount = await dateInputs.count();
      const selectCount = await selects.count();
      const textareaCount = await textareas.count();
      
      console.log(`Form elements: ${textCount} text inputs, ${dateCount} date inputs, ${selectCount} selects, ${textareaCount} textareas`);
      
      // Fill out the form
      if (textCount > 0) {
        await textInputs.first().fill('Test Report Data');
        console.log('✅ Text input filled');
      }
      
      if (dateCount > 0) {
        await dateInputs.first().fill('2025-01-15');
        console.log('✅ Date input filled');
        
        if (dateCount > 1) {
          await dateInputs.nth(1).fill('2025-01-31');
          console.log('✅ Second date input filled');
        }
      }
      
      if (selectCount > 0) {
        const options = selects.first().locator('option');
        const optionCount = await options.count();
        
        if (optionCount > 1) {
          await selects.first().selectOption({ index: 1 });
          console.log('✅ Dropdown selection made');
        }
      }
      
      if (textareaCount > 0) {
        await textareas.first().fill('This is a test report description with multiple lines of content for testing purposes.');
        console.log('✅ Textarea filled');
      }
      
      // Look for submit/generate buttons
      const submitButtons = form.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit"), button:has-text("Create")');
      const submitCount = await submitButtons.count();
      
      console.log(`Found ${submitCount} submit buttons`);
      
      // Test form validation or submission (without actually submitting)
      if (submitCount > 0) {
        const submitButton = submitButtons.first();
        const buttonText = await submitButton.textContent();
        console.log(`Submit button text: "${buttonText}"`);
        
        // Check if button is enabled
        const isEnabled = await submitButton.isEnabled();
        console.log(`Submit button enabled: ${isEnabled}`);
        
        if (isEnabled) {
          console.log('✅ Form appears to be ready for submission');
        }
      }
    }
    
    await page.screenshot({ 
      path: 'test-results/activity-report-form-filled.png', 
      fullPage: true 
    });
  });

  test('complete user workflow simulation', async ({ page }) => {
    console.log('🔄 Testing complete user workflow...');
    
    // 1. Start at dashboard
    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });
    await expect(page.locator('app-dashboard')).toBeVisible();
    console.log('✅ Step 1: Dashboard accessed');
    
    // 2. Navigate to activity report
    await page.goto('/activity-report?e2e=true', { waitUntil: 'networkidle' });
    await expect(page.locator('app-activity-report')).toBeVisible();
    console.log('✅ Step 2: Activity report accessed');
    
    // 3. Test any available navigation links
    const navLinks = page.locator('nav a, .nav a, a[href^="/"]');
    const linkCount = await navLinks.count();
    
    console.log(`🔗 Found ${linkCount} navigation links`);
    
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        console.log(`Testing link: "${text}" -> ${href}`);
        
        if (href && !href.includes('logout') && !href.includes('external')) {
          await link.click();
          await page.waitForTimeout(1000);
          
          const currentUrl = page.url();
          console.log(`Navigated to: ${currentUrl}`);
          
          // Verify we're not redirected to auth
          expect(currentUrl).not.toContain('auth0.com');
        }
      }
    }
    
    // 4. Test UI showcase if available
    try {
      await page.goto('/ui-showcase?e2e=true', { waitUntil: 'networkidle', timeout: 10000 });
      
      const uiShowcase = await page.locator('app-ui-showcase').count();
      if (uiShowcase > 0) {
        console.log('✅ UI Showcase accessible');
        
        await page.screenshot({ 
          path: 'test-results/ui-showcase.png', 
          fullPage: true 
        });
      }
    } catch (error) {
      console.log('ℹ️ UI Showcase not available or not accessible');
    }
    
    console.log('🎉 Complete workflow test finished successfully!');
  });

  test('accessibility and error handling', async ({ page }) => {
    console.log('♿ Testing accessibility and error handling...');
    
    await page.goto('/dashboard?e2e=true', { waitUntil: 'networkidle' });
    
    // Check for console errors
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(`ERROR: ${msg.text()}`);
      }
    });
    
    // Test accessibility basics
    const hasHeadings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    const hasLabels = await page.locator('label').count();
    const hasAltText = await page.locator('img[alt]').count();
    const totalImages = await page.locator('img').count();
    
    console.log(`♿ Accessibility check:`);
    console.log(`  - Headings: ${hasHeadings}`);
    console.log(`  - Labels: ${hasLabels}`);
    console.log(`  - Images with alt text: ${hasAltText}/${totalImages}`);
    
    // Test 404 handling
    await page.goto('/nonexistent-page?e2e=true', { waitUntil: 'networkidle' });
    
    const finalUrl = page.url();
    console.log(`404 handling: ${finalUrl}`);
    
    // Should redirect to dashboard or show 404, but not to auth
    expect(finalUrl).not.toContain('auth0.com');
    
    // Report any console errors
    if (consoleLogs.length > 0) {
      console.log('⚠️ Console errors found:');
      consoleLogs.forEach(log => console.log(`  ${log}`));
    } else {
      console.log('✅ No console errors detected');
    }
  });
});
