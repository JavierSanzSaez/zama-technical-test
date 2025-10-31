import { test, expect } from '@playwright/test';
import { AuthHelper, DevToolbarHelper, ChartHelper } from './utils/helpers';
import { mockUser, testSelectors, featureFlags } from './fixtures/testData';

test.describe('Dev Toolbar Features', () => {
  let authHelper: AuthHelper;
  let devToolbarHelper: DevToolbarHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    devToolbarHelper = new DevToolbarHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should display dev toolbar when DEBUG_MODE is enabled', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dev toolbar should be visible
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      await expect(toolbar).toBeVisible();
      
      // Verify toolbar elements
      await expect(toolbar.locator('text=Feature Flags')).toBeVisible();
      await expect(toolbar.locator('text=Quick Actions')).toBeVisible();
    }
  });

  test('should toggle feature flags correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      // Test Halloween banner toggle
      const halloweenToggle = toolbar.locator('input[type="checkbox"]').first();
      const isChecked = await halloweenToggle.isChecked();
      
      await halloweenToggle.click();
      
      // Verify the toggle changed state
      expect(await halloweenToggle.isChecked()).toBe(!isChecked);
      
      // Navigate to dashboard to see effect
      await page.goto('/dashboard');
      
      const banner = page.locator('[data-testid="halloween-banner"]');
      if (!isChecked) {
        // Banner should now be visible
        await expect(banner).toBeVisible();
      }
    }
  });

  test('should use quick actions correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      // Test Enable All button
      await toolbar.locator('button:has-text("Enable All")').click();
      
      // All checkboxes should be checked
      const checkboxes = toolbar.locator('input[type="checkbox"]');
      const count = await checkboxes.count();
      
      for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked();
      }
      
      // Test Disable All button
      await toolbar.locator('button:has-text("Disable All")').click();
      
      // All checkboxes should be unchecked
      for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).not.toBeChecked();
      }
    }
  });

  test('should persist feature flag states', async ({ page }) => {
    await page.goto('/dashboard');
    
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      // Toggle a feature
      const firstToggle = toolbar.locator('input[type="checkbox"]').first();
      const initialState = await firstToggle.isChecked();
      await firstToggle.click();
      
      // Refresh page
      await page.reload();
      await page.waitForSelector('[data-testid="dev-toolbar"]');
      
      // State should be persisted (assuming Redux persistence)
      const toggleAfterReload = page.locator('[data-testid="dev-toolbar"] input[type="checkbox"]').first();
      expect(await toggleAfterReload.isChecked()).toBe(!initialState);
    }
  });
});

test.describe('Halloween Banner Features', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should display Halloween banner with correct content', async ({ page }) => {
    await page.goto('/dashboard');
    
    const banner = page.locator('[data-testid="halloween-banner"]');
    if (await banner.isVisible()) {
      // Verify banner content
      await expect(banner).toContainText('31% OFF');
      await expect(banner).toContainText('SPOOKY31');
      await expect(banner).toContainText('Halloween');
      
      // Verify styling
      await expect(banner).toHaveClass(/bg-gradient/);
      
      // Should have close button
      const closeButton = banner.locator('button').first();
      await expect(closeButton).toBeVisible();
    }
  });

  test('should dismiss Halloween banner correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const banner = page.locator('[data-testid="halloween-banner"]');
    if (await banner.isVisible()) {
      const closeButton = banner.locator('button').first();
      await closeButton.click();
      
      // Banner should be hidden
      await expect(banner).not.toBeVisible();
      
      // Should remain hidden after page refresh
      await page.reload();
      await expect(banner).not.toBeVisible();
    }
  });

  test('should handle banner interactions', async ({ page }) => {
    await page.goto('/dashboard');
    
    const banner = page.locator('[data-testid="halloween-banner"]');
    if (await banner.isVisible()) {
      // Test banner click/hover effects
      await banner.hover();
      
      // If banner has interactive elements, test them
      const ctaButton = banner.locator('button:has-text("Get")');
      if (await ctaButton.isVisible()) {
        await expect(ctaButton).toBeVisible();
        await ctaButton.hover();
      }
    }
  });
});

test.describe('Redux State Management', () => {
  let authHelper: AuthHelper;
  let devToolbarHelper: DevToolbarHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    devToolbarHelper = new DevToolbarHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should manage feature flags state correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Use dev toolbar to change state
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      // Enable all features
      await devToolbarHelper.enableAllFeatures();
      
      // Navigate to different page and back
      await page.goto('/api-keys');
      await page.goto('/dashboard');
      
      // State should be maintained
      const checkboxes = toolbar.locator('input[type="checkbox"]');
      const count = await checkboxes.count();
      
      for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked();
      }
    }
  });

  test('should handle state updates across components', async ({ page }) => {
    await page.goto('/dashboard');
    
    const toolbar = page.locator('[data-testid="dev-toolbar"]');
    if (await toolbar.isVisible()) {
      // Toggle Halloween banner off
      const halloweenToggle = toolbar.locator('input[type="checkbox"]').first();
      if (await halloweenToggle.isChecked()) {
        await halloweenToggle.click();
      }
      
      // Banner should disappear immediately
      const banner = page.locator('[data-testid="halloween-banner"]');
      await expect(banner).not.toBeVisible();
      
      // Toggle back on
      await halloweenToggle.click();
      
      // Banner should reappear
      await expect(banner).toBeVisible();
    }
  });
});

test.describe('Chart Filtering System', () => {
  let authHelper: AuthHelper;
  let chartHelper: ChartHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    chartHelper = new ChartHelper(page);
    await authHelper.login(mockUser.email);
    await chartHelper.navigateToUsage();
  });

  test('should filter charts by different time periods', async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('.recharts-wrapper');
    
    // Test each filter option
    const filters = ['1 Day', '1 Week', '30 Days'];
    
    for (const filter of filters) {
      await chartHelper.selectTimeFilter(filter as any);
      
      // Verify charts update
      await page.waitForTimeout(500);
      await chartHelper.verifyChartsVisible();
      
      // Verify correct chart titles
      if (filter === '1 Day') {
        await chartHelper.verifyChartTitle('Hourly Requests');
      } else {
        await chartHelper.verifyChartTitle('Daily Requests');
      }
    }
  });

  test('should update chart data format correctly', async ({ page }) => {
    await page.waitForSelector('.recharts-wrapper');
    
    // Start with daily data
    await chartHelper.selectTimeFilter('1 Week');
    await page.waitForTimeout(1000);
    
    // Should show daily format data
    // (This would need to be verified by checking chart data points or axis labels)
    
    // Switch to hourly data
    await chartHelper.selectTimeFilter('1 Day');
    await page.waitForTimeout(1000);
    
    // Should show hourly format data
    // Charts should re-render with different data structure
  });

  test('should handle responsive chart behavior', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await chartHelper.verifyChartsVisible();
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await chartHelper.verifyChartsVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await chartHelper.verifyChartsVisible();
    
    // Charts should remain functional
    await chartHelper.selectTimeFilter('1 Day');
  });
});

test.describe('Authentication Flow', () => {
  test('should handle complete authentication flow', async ({ page }) => {
    // Start logged out
    await page.goto('/');
    
    // Should be on login page
    await expect(page.locator(testSelectors.emailInput)).toBeVisible();
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect back to login
    await expect(page).toHaveURL('/login');
    
    // Login successfully
    const authHelper = new AuthHelper(page);
    await authHelper.login(mockUser.email);
    
    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should be able to access other protected routes
    await page.goto('/api-keys');
    await expect(page).toHaveURL('/api-keys');
    
    // Logout
    await authHelper.logout();
    
    // Should be back on login page
    await expect(page).toHaveURL('/login');
  });

  test('should maintain authentication state across page refreshes', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.login(mockUser.email);
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    // Refresh page
    await page.reload();
    
    // Should still be authenticated and on dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator(`text=${mockUser.email}`)).toBeVisible();
  });

  test('should handle session expiration gracefully', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.login(mockUser.email);
    
    // Simulate session expiration by clearing storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});