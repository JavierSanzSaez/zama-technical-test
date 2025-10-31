import { test, expect } from '@playwright/test';
import { AuthHelper, APIKeysHelper, ChartHelper, DevToolbarHelper } from './utils/helpers';
import { mockUser, testMessages } from './fixtures/testData';

test.describe('Complete User Workflows', () => {
  let authHelper: AuthHelper;
  let apiKeysHelper: APIKeysHelper;
  let chartHelper: ChartHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    apiKeysHelper = new APIKeysHelper(page);
    chartHelper = new ChartHelper(page);
  });

  test('Complete new user onboarding flow', async ({ page }) => {
    // 1. User logs in for first time
    await authHelper.login(mockUser.email);
    await expect(page).toHaveURL('/dashboard');

    // 2. User explores dashboard
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    // 3. User creates their first API key
    await apiKeysHelper.navigateToAPIKeys();
    
    // Should see empty state or existing keys
    const emptyState = page.locator('text=No API keys yet');
    const createButton = page.locator('button:has-text("Create New Key")');
    
    await expect(createButton).toBeVisible();
    
    // Create first API key
    const keyName = 'My First API Key';
    const keyCard = await apiKeysHelper.createAPIKey(keyName);
    
    // 4. User copies the API key (critical security flow)
    await expect(page.locator('text=' + testMessages.apiKeyCreated)).toBeVisible();
    await apiKeysHelper.copyAPIKey(keyCard);
    
    // 5. User hides the API key
    await apiKeysHelper.hideAPIKey(keyCard);
    
    // 6. User explores usage analytics
    await chartHelper.navigateToUsage();
    await page.waitForSelector('.recharts-wrapper');
    await chartHelper.verifyChartsVisible();
    
    // 7. User tries different time filters
    await chartHelper.selectTimeFilter('1 Day');
    await chartHelper.verifyChartTitle('Hourly Requests');
    
    await chartHelper.selectTimeFilter('1 Week');
    await chartHelper.verifyChartTitle('Daily Requests');
    
    // 8. User checks documentation
    await page.click('a[href="/docs"]');
    await expect(page).toHaveURL('/docs');
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
    
    // 9. User logs out
    await authHelper.logout();
    await expect(page).toHaveURL('/login');
  });

  test('API Key management workflow', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await apiKeysHelper.navigateToAPIKeys();
    
    // Create multiple API keys for different purposes
    const keys = [
      'Production API Key',
      'Development API Key', 
      'Testing API Key'
    ];
    
    const createdKeys = [];
    
    for (const keyName of keys) {
      const keyCard = await apiKeysHelper.createAPIKey(keyName + ' ' + Date.now());
      createdKeys.push(keyCard);
      
      // Copy each key immediately
      await apiKeysHelper.copyAPIKey(keyCard);
      
      // Hide the key
      await apiKeysHelper.hideAPIKey(keyCard);
    }
    
    // Revoke one key
    if (createdKeys.length > 0) {
      const firstKeyCard = createdKeys[0];
      if (await firstKeyCard.locator('button:has-text("Revoke")').isVisible()) {
        await apiKeysHelper.revokeAPIKey(firstKeyCard);
      }
    }
    
    // Delete one key
    if (createdKeys.length > 1) {
      const keyToDelete = createdKeys[1];
      const keyName = await keyToDelete.locator('.text-lg.font-semibold').textContent();
      if (keyName) {
        await apiKeysHelper.deleteAPIKey(keyToDelete, keyName);
      }
    }
  });

  test('Data analytics exploration workflow', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await chartHelper.navigateToUsage();
    
    // Wait for initial chart load
    await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    
    // Explore different time periods systematically (using actual filter labels)
    const filters = ['1 Day', '1 Week', '30 Days'] as const;
    
    for (const filter of filters) {
      await chartHelper.selectTimeFilter(filter);
      await page.waitForTimeout(1000);
      
      // Verify charts are responsive and data loads
      await chartHelper.verifyChartsVisible();
      
      // Check for data visualization elements
      const chartElements = page.locator('.recharts-wrapper svg');
      expect(await chartElements.count()).toBe(2);
      
      // Verify appropriate titles
      if (filter === '1 Day') {
        await expect(page.locator('text=Hourly Requests')).toBeVisible();
      } else {
        await expect(page.locator('text=Daily Requests')).toBeVisible();
      }
    }
    
    // Test responsive behavior
    await page.setViewportSize({ width: 768, height: 1024 });
    await chartHelper.verifyChartsVisible();
    
    await page.setViewportSize({ width: 375, height: 667 });
    await chartHelper.verifyChartsVisible();
    
    // Return to desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('Feature flag and development workflow', async ({ page }) => {
    await authHelper.login(mockUser.email);
    
    const devToolbarHelper = new DevToolbarHelper(page);
    
    // Navigate to dashboard to see dev toolbar
    await page.goto('/dashboard');
    
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    
    if (await toolbar.isVisible()) {
      // Test systematic feature flag toggling
      await devToolbarHelper.disableAllFeatures();
      
      // Verify Halloween banner is hidden
      const banner = page.locator('[data-testid="halloween-banner"]');
      await expect(banner).not.toBeVisible();
      
      // Enable Halloween banner specifically
      await devToolbarHelper.toggleFeatureFlag('HALLOWEEN_BANNER');
      
      // Banner should appear
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('31% OFF');
      
      // Test banner interaction
      const closeButton = banner.locator('button').first();
      await closeButton.click();
      await expect(banner).not.toBeVisible();
      
      // Re-enable banner via dev toolbar
      await devToolbarHelper.toggleFeatureFlag('HALLOWEEN_BANNER');
      await expect(banner).toBeVisible();
      
      // Test bulk operations
      await devToolbarHelper.enableAllFeatures();
      await devToolbarHelper.resetFeatures();
      
      // Navigate between pages to test persistence
      await page.goto('/api-keys');
      await page.goto('/usage');
      await page.goto('/dashboard');
      
      // Dev toolbar should still be visible and functional
      await expect(toolbar).toBeVisible();
    }
  });

  test('Error handling and edge cases', async ({ page }) => {
    await authHelper.login(mockUser.email);
    
    // Test form validation edge cases
    await apiKeysHelper.navigateToAPIKeys();
    await page.click('button:has-text("Create New Key")');
    
    const keyInput = page.locator('input[placeholder*="Production API Key"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Test various invalid inputs
    const invalidInputs = ['', '   ', '\t', '\n'];
    
    for (const input of invalidInputs) {
      await keyInput.fill(input);
      await expect(submitButton).toBeDisabled();
    }
    
    // Test very long key name
    const longName = 'A'.repeat(100);
    await keyInput.fill(longName);
    await expect(submitButton).toBeEnabled();
    
    // Test special characters
    await keyInput.fill('Test Key @#$%');
    await expect(submitButton).toBeEnabled();
    
    // Cancel form
    await page.click('button:has-text("Cancel")');
    
    // Test navigation edge cases
    await page.goto('/nonexistent-page');
    // Should handle 404 gracefully (depending on router setup)
    
    // Test rapid navigation
    await page.goto('/dashboard');
    await page.goto('/api-keys');
    await page.goto('/usage');
    await page.goto('/docs');
    await page.goto('/dashboard');
    
    // Should handle rapid navigation without errors
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Cross-browser compatibility workflow', async ({ page, browserName }) => {
    // This test runs across all configured browsers
    await authHelper.login(mockUser.email);
    
    // Test core functionality works across browsers
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    // Test CSS and layout
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Test JavaScript functionality
    await apiKeysHelper.navigateToAPIKeys();
    
    // Test form interactions
    await page.click('button:has-text("Create New Key")');
    const keyInput = page.locator('input[placeholder*="Production API Key"]');
    await keyInput.fill(`Test Key ${browserName}`);
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    
    // Cancel and continue
    await page.click('button:has-text("Cancel")');
    
    // Test charts (important for cross-browser compatibility)
    await chartHelper.navigateToUsage();
    await page.waitForSelector('.recharts-wrapper');
    await chartHelper.verifyChartsVisible();
    
    // Test filter interactions
    await chartHelper.selectTimeFilter('1 Day');
    await page.waitForTimeout(1000);
    await chartHelper.verifyChartsVisible();
  });
});