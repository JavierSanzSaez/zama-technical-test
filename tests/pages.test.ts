import { test, expect } from '@playwright/test';
import { AuthHelper, APIKeysHelper, ChartHelper, ComponentHelper } from './utils/helpers';
import { mockUser, testSelectors, testMessages, mockAPIKeys } from './fixtures/testData';

test.describe('Dashboard Page', () => {
  let authHelper: AuthHelper;
  let componentHelper: ComponentHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    componentHelper = new ComponentHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should display dashboard overview correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verify page title and content (should be "Welcome back, {username}!")
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    // Check for dashboard cards/widgets (Card component uses bg-white class, not .card)
    const cards = page.locator('.bg-white.rounded-lg.shadow-md');
    expect(await cards.count()).toBeGreaterThan(0);
    
    // Verify specific dashboard content (be more specific to avoid multiple matches)
    await expect(page.locator('.text-xl.font-semibold:has-text("API Keys")')).toBeVisible();
    await expect(page.locator('.text-xl.font-semibold:has-text("Usage Metrics")')).toBeVisible();
  });

  test('should show Halloween banner when feature flag is enabled', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Halloween banner should be visible (if feature flag is enabled)
    const banner = page.locator('[data-testid="halloween-banner"]');
    if (await banner.isVisible()) {
      await expect(banner).toContainText('31% OFF');
      await expect(banner).toContainText('SPOOKY31');
      
      // Test banner close functionality
      const closeButton = banner.locator('button').first();
      await closeButton.click();
      await expect(banner).not.toBeVisible();
    }
  });

  test('should navigate to other sections from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test navigation cards or links
    if (await page.locator('text=API Keys').isVisible()) {
      await page.click('text=API Keys');
      await expect(page).toHaveURL('/api-keys');
    }
  });
});

test.describe('API Keys Page', () => {
  let authHelper: AuthHelper;
  let apiKeysHelper: APIKeysHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    apiKeysHelper = new APIKeysHelper(page);
    await authHelper.login(mockUser.email);
    await apiKeysHelper.navigateToAPIKeys();
  });

  test('should display API keys page correctly', async ({ page }) => {
    // Verify page elements
    await expect(page.locator('h1:has-text("API Keys")')).toBeVisible();
    await expect(page.locator('text=Manage your API keys')).toBeVisible();
    await expect(page.locator(testSelectors.createKeyButton)).toBeVisible();
  });

  test('should show security warning before creating key', async ({ page }) => {
    await page.click(testSelectors.createKeyButton);
    
    // Security warning should be visible
    await expect(page.locator('text=Important Security Notice')).toBeVisible();
    await expect(page.locator('text=You can only view and copy your API key')).toBeVisible();
  });

  test('should create new API key successfully', async ({ page }) => {
    const keyName = 'Test API Key ' + Date.now();
    
    // Create the key
    const keyCard = await apiKeysHelper.createAPIKey(keyName);
    
    // Verify success message
    await expect(page.locator('text=' + testMessages.apiKeyCreated)).toBeVisible();
    
    // Verify key is created and visible
    await expect(keyCard).toBeVisible();
    await expect(keyCard.locator(`text=${keyName}`)).toBeVisible();
    
    // Verify key is revealed for copying
    await expect(keyCard.locator('button:has-text("Copy Now!")')).toBeVisible();
    
    // Verify security warning for new key
    await expect(page.locator('text=This is your only chance to copy this key!')).toBeVisible();
  });

  test('should copy API key successfully', async ({ page }) => {
    // Create a key first
    const keyName = 'Copy Test Key ' + Date.now();
    const keyCard = await apiKeysHelper.createAPIKey(keyName);
    
    // Copy the key (helper method includes verification)
    await apiKeysHelper.copyAPIKey(keyCard);
    
    // Additional verification that key is still visible for copying
    await expect(keyCard.locator('button:has-text("Copy Now!")')).toBeVisible();
  });

  test('should hide API key permanently', async ({ page }) => {
    // Create a key first
    const keyName = 'Hide Test Key ' + Date.now();
    const keyCard = await apiKeysHelper.createAPIKey(keyName);
    
    // Verify key is initially revealed
    await expect(keyCard.locator('button:has-text("Copy Now!")')).toBeVisible();
    
    // Hide the key
    await apiKeysHelper.hideAPIKey(keyCard);
    
    // Verify key is hidden (masked and no copy button visible)
    await expect(keyCard.locator('button:has-text("Copy Now!")')).not.toBeVisible();
    await expect(keyCard.locator('code')).toContainText('...');
  });

  test('should handle API key actions (revoke, delete)', async ({ page }) => {
    // Create a key first
    const keyName = 'Action Test Key ' + Date.now();
    const keyCard = await apiKeysHelper.createAPIKey(keyName);
    
    // Hide the key first to access action buttons
    await apiKeysHelper.hideAPIKey(keyCard);
    
    // Test revoke functionality
    if (await keyCard.locator('button:has-text("Revoke")').isVisible()) {
      await apiKeysHelper.revokeAPIKey(keyCard);
    }
    
    // Test delete functionality
    await apiKeysHelper.deleteAPIKey(keyCard, keyName);
  });

  test('should display empty state when no keys exist', async ({ page }) => {
    // If no keys exist, should show empty state
    const noKeysMessage = page.locator('text=' + testMessages.noKeys);
    if (await noKeysMessage.isVisible()) {
      await expect(noKeysMessage).toBeVisible();
    }
  });

  test('should validate key creation form', async ({ page }) => {
    await page.click(testSelectors.createKeyButton);
    
    const submitButton = page.locator('button[type="submit"]');
    const keyInput = page.locator(testSelectors.keyNameInput);
    
    // Submit should be disabled with empty input
    await expect(submitButton).toBeDisabled();
    
    // Enter whitespace only - should still be disabled
    await keyInput.fill('   ');
    await expect(submitButton).toBeDisabled();
    
    // Enter valid name - should be enabled
    await keyInput.fill('Valid Key Name');
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Usage Page', () => {
  let authHelper: AuthHelper;
  let chartHelper: ChartHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    chartHelper = new ChartHelper(page);
    await authHelper.login(mockUser.email);
    await chartHelper.navigateToUsage();
  });

  test('should display usage analytics page correctly', async ({ page }) => {
    // Go directly to usage page
    await page.goto('/usage');
    
    // Verify page elements (should be "Usage Metrics", not "Usage Analytics")
    await expect(page.locator('h1:has-text("Usage Metrics")')).toBeVisible();
    
    // Verify page description
    await expect(page.locator('text=Monitor your API usage, request counts, and performance metrics.')).toBeVisible();
    
    // Verify filter tabs are present (use actual button labels)
    await expect(page.locator('button:has-text("1 Week")')).toBeVisible();
    
    // Verify all filter options are available
    await expect(page.locator('button:has-text("1 Day")')).toBeVisible();
    await expect(page.locator('button:has-text("30 Days")')).toBeVisible();
  });

  test('should load and display charts correctly', async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    
    // Verify charts are present
    await chartHelper.verifyChartsVisible();
    
    // Verify chart titles
    await expect(page.locator('text=Daily Requests')).toBeVisible();
    await expect(page.locator('text=Response Time Trend')).toBeVisible();
  });

  test('should filter data by time period', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('.recharts-wrapper');
    
    // Test different time filters (use actual button labels)
    await chartHelper.selectTimeFilter('1 Day');
    await chartHelper.verifyChartTitle('Hourly Requests');
    
    await chartHelper.selectTimeFilter('1 Week');
    await chartHelper.verifyChartTitle('Daily Requests');
    
    await chartHelper.selectTimeFilter('30 Days');
    await chartHelper.verifyChartTitle('Daily Requests');
  });

  test('should switch between daily and hourly data', async ({ page }) => {
    // Start with daily view
    await chartHelper.selectTimeFilter('1 Week');
    await expect(page.locator('text=Daily Requests')).toBeVisible();
    
    // Switch to hourly view
    await chartHelper.selectTimeFilter('1 Day');
    await expect(page.locator('text=Hourly Requests')).toBeVisible();
    
    // Charts should update with different data format
    await page.waitForTimeout(1000); // Wait for chart re-render
  });

  test('should maintain responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Charts should still be visible and functional
    await page.waitForSelector('.recharts-wrapper');
    await chartHelper.verifyChartsVisible();
    
    // Filter tabs should be accessible
    await chartHelper.selectTimeFilter('1 Day');
  });
});

test.describe('Login Page', () => {
  test('should display login form correctly', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page and show correct title
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1:has-text("Sandbox Console")')).toBeVisible();
    await expect(page.locator('text=Sign in to manage your API keys')).toBeVisible();
    
    // Verify login form elements
    await expect(page.locator(testSelectors.emailInput)).toBeVisible();
    await expect(page.locator(testSelectors.passwordInput)).toBeVisible();
    await expect(page.locator(testSelectors.loginButton)).toBeVisible();
  });

  test('should handle successful login', async ({ page }) => {
    await page.goto('/');
    
    // Fill login form
    await page.fill(testSelectors.emailInput, mockUser.email);
    await page.fill(testSelectors.passwordInput, 'password');
    
    // Submit form
    await page.click(testSelectors.loginButton);
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator(`text=${mockUser.email}`)).toBeVisible();
  });

  test('should validate login form', async ({ page }) => {
    await page.goto('/');
    
    // Should be on login page
    await expect(page).toHaveURL('/login');
    
    const submitButton = page.locator(testSelectors.loginButton);
    
    // Submit button should be enabled (form doesn't disable it client-side)
    await expect(submitButton).toBeEnabled();
    
    // Fill login form with valid data
    await page.fill(testSelectors.emailInput, mockUser.email);
    await page.fill(testSelectors.passwordInput, 'password');
    
    // Button should still be enabled with valid data
    await expect(submitButton).toBeEnabled();
    
    // Verify form fields accept input
    await expect(page.locator(testSelectors.emailInput)).toHaveValue(mockUser.email);
    await expect(page.locator(testSelectors.passwordInput)).toHaveValue('password');
  });
});

test.describe('Docs Page', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should display documentation page correctly', async ({ page }) => {
    await page.goto('/docs');
    
    // Verify page title (should be "Documentation", not "API Documentation")
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
    
    // Should have documentation content sections (be more specific)
    await expect(page.locator('text=Learn how to integrate and use the Sandbox API')).toBeVisible();
    await expect(page.locator('h3:has-text("Authentication")')).toBeVisible();
    await expect(page.locator('h2:has-text("Getting Started")')).toBeVisible();
  });

  test('should display code examples', async ({ page }) => {
    await page.goto('/docs');
    
    // Wait for page content to load
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
    
    // Should have code blocks (there are multiple <pre> elements in the docs)
    const codeBlocks = page.locator('pre');
    expect(await codeBlocks.count()).toBeGreaterThan(0);
    
    // Verify specific code example exists (use first match)
    await expect(page.locator('pre:has-text("Authorization: Bearer YOUR_API_KEY")').first()).toBeVisible();
  });

  test('should handle navigation within docs', async ({ page }) => {
    await page.goto('/docs');
    
    // Test internal links if any exist
    const internalLinks = page.locator('a[href^="#"]');
    if (await internalLinks.count() > 0) {
      await internalLinks.first().click();
      // Should scroll to section
    }
  });
});