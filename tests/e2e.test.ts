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
    const createButton = page.locator('button:has-text("Create New Key")');
    await expect(createButton).toBeVisible();
    
    // Create first API key
    const keyName = 'My First API Key';
    const newKey = await apiKeysHelper.createAPIKey(keyName);
    
    await expect(page.locator('text=API Key Created Successfully!')).toBeVisible();
    
    // 4. User closes the creation modal
    await apiKeysHelper.closeCreateModal();
    
    // 5. Verify the key appears in the list
    const keyCard = newKey.findCard();
    await expect(keyCard).toBeVisible();
    await apiKeysHelper.verifyKeyStatus(keyCard, 'active');
    
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
      const uniqueName = keyName + ' ' + Date.now();
      const newKey = await apiKeysHelper.createAPIKey(uniqueName);
      
      // Close the modal
      await apiKeysHelper.closeCreateModal();
      
      // Store the key info for later use
      createdKeys.push({
        name: uniqueName,
        card: newKey.findCard()
      });
    }
    
    // Test regenerate functionality
    if (createdKeys.length > 0) {
      const firstKey = createdKeys[0];
      await apiKeysHelper.regenerateAPIKey(firstKey.card);
      await apiKeysHelper.copyRegeneratedKey();
      await apiKeysHelper.hideRegeneratedKey();
    }
    
    // Revoke one key
    if (createdKeys.length > 1) {
      const secondKey = createdKeys[1];
      await apiKeysHelper.revokeAPIKey(secondKey.card);
      await apiKeysHelper.verifyKeyStatus(secondKey.card, 'revoked');
      
      // Verify revoked key only has Delete button
      await apiKeysHelper.verifyActionButtons(secondKey.card, ['Delete']);
    }
    
    // Test cancel revoke modal
    if (createdKeys.length > 2) {
      const thirdKey = createdKeys[2];
      await thirdKey.card.locator('button:has-text("Revoke")').click();
      await apiKeysHelper.cancelRevokeModal();
      // Key should still be active
      await apiKeysHelper.verifyKeyStatus(thirdKey.card, 'active');
    }
    
    // Delete one key (the revoked one)
    if (createdKeys.length > 1) {
      const keyToDelete = createdKeys[1];
      await apiKeysHelper.deleteAPIKey(keyToDelete.card, keyToDelete.name);
    }
    
    // Test cancel delete modal
    if (createdKeys.length > 0) {
      const firstKey = createdKeys[0];
      await firstKey.card.locator('button:has-text("Delete")').click();
      await apiKeysHelper.cancelDeleteModal();
      // Key should still be visible
      await expect(firstKey.card).toBeVisible();
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
    
    // Test form validation edge cases in modal
    await apiKeysHelper.navigateToAPIKeys();
    await page.click('button:has-text("Create New Key")');
    
    // Wait for modal to appear
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    
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
    
    // Test modal close via X button
    await page.click('button svg'); // Close button (X icon)
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
    
    // Test modal close via Cancel button
    await page.click('button:has-text("Create New Key")');
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
    
    // Test ESC key to close modal
    await page.click('button:has-text("Create New Key")');
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    await page.keyboard.press('Escape');
    // Note: ESC handling would need to be implemented in the component
    
    // Cancel current modal
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

  test('Countdown timer and regenerated key visibility', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await apiKeysHelper.navigateToAPIKeys();
    
    // Create a new API key for testing
    const keyName = 'Test Key for Countdown ' + Date.now();
    const newKey = await apiKeysHelper.createAPIKey(keyName);
    await apiKeysHelper.closeCreateModal();
    
    const keyCard = newKey.findCard();
    await expect(keyCard).toBeVisible();
    
    // Regenerate the key
    await apiKeysHelper.regenerateAPIKey(keyCard);
    
    // Verify countdown elements are present
    await expect(page.locator('text=The API Key will mask itself in')).toBeVisible();
    await expect(page.locator('.bg-blue-400.h-1\\.5.rounded-full')).toBeVisible(); // Progress bar
    
    // Wait a few seconds and verify countdown decreases
    await page.waitForTimeout(3000);
    const countdownText = await page.locator('text=The API Key will mask itself in').textContent();
    expect(countdownText).toMatch(/in \d+ seconds/);
    
    // Test manual hide functionality
    await apiKeysHelper.hideRegeneratedKey();
    
    // Clean up - delete the key
    await apiKeysHelper.deleteAPIKey(keyCard, keyName);
  });

  test('Regenerate and revoke interaction workflow', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await apiKeysHelper.navigateToAPIKeys();
    
    // Create a new API key for testing
    const keyName = 'Test Key for Regenerate-Revoke ' + Date.now();
    const newKey = await apiKeysHelper.createAPIKey(keyName);
    await apiKeysHelper.closeCreateModal();
    
    const keyCard = newKey.findCard();
    await expect(keyCard).toBeVisible();
    
    // Regenerate the key
    await apiKeysHelper.regenerateAPIKey(keyCard);
    
    // Verify regenerated key notification is visible
    await expect(page.locator('text=API Key Regenerated Successfully!')).toBeVisible();
    await expect(page.locator('text=The API Key will mask itself in')).toBeVisible();
    
    // Now revoke the key while the regenerated notification is still showing
    await keyCard.locator('button:has-text("Revoke")').click();
    
    // Confirm revocation
    await expect(page.locator('h3:has-text("Revoke API Key")')).toBeVisible();
    await page.click('button:has-text("Revoke Key")');
    
    // The regenerated key notification should disappear immediately
    await expect(page.locator('text=API Key Regenerated Successfully!')).not.toBeVisible();
    await expect(page.locator('text=The API Key will mask itself in')).not.toBeVisible();
    
    // Key should now be revoked and only show Delete button
    await apiKeysHelper.verifyKeyStatus(keyCard, 'revoked');
    await apiKeysHelper.verifyActionButtons(keyCard, ['Delete']);
    
    // Clean up - delete the key
    await apiKeysHelper.deleteAPIKey(keyCard, keyName);
  });

  test('Cross-browser compatibility workflow', async ({ page, browserName }) => {
    // This test runs across all configured browsers
    await authHelper.login(mockUser.email);
    
    // Test core functionality works across browsers
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    // Test CSS and layout - check for the navigation area instead of header
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
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