import { Page, Locator, expect } from '@playwright/test';

/**
 * Test utilities for authentication flows
 */
export class AuthHelper {
  constructor(private page: Page) {}

  async login(email: string = 'test@example.com', password: string = 'password') {
    // Start from root - this will redirect to /login if not authenticated
    await this.page.goto('/');
    
    // Check if already logged in (if we're already on dashboard)
    const currentUrl = this.page.url();
    if (currentUrl.includes('/dashboard')) {
      return; // Already logged in
    }
    
    // Should be redirected to login page if not authenticated
    await expect(this.page).toHaveURL('/login');
    
    // Wait for login form to be visible
    await expect(this.page.locator('input[type="email"]')).toBeVisible();
    await expect(this.page.locator('input[type="password"]')).toBeVisible();
    
    // Fill login form
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    
    // Submit login
    await this.page.click('button[type="submit"]');
    
    // Wait for successful login redirect to dashboard
    await expect(this.page).toHaveURL('/dashboard');
    
    // Wait for dashboard content to load
    await expect(this.page.locator('h1')).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.page.click('button:has-text("Logout")');
    // After logout, should redirect to login page
    await expect(this.page).toHaveURL('/login');
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * Test utilities for API Keys functionality
 */
export class APIKeysHelper {
  constructor(private page: Page) {}

  async navigateToAPIKeys() {
    await this.page.click('a[href="/api-keys"]');
    await expect(this.page).toHaveURL('/api-keys');
    await expect(this.page.locator('h1:has-text("API Keys")')).toBeVisible();
  }

  async createAPIKey(name: string) {
    // Click create new key button
    await this.page.click('button:has-text("Create New Key")');
    
    // Wait for form to appear
    await expect(this.page.locator('input[placeholder*="Production API Key"]')).toBeVisible();
    
    // Fill key name
    await this.page.fill('input[placeholder*="Production API Key"]', name);
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(this.page.locator('text=API Key Created Successfully!')).toBeVisible();
    
    // Return the newly created key element
    return this.page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: name }).first();
  }

  async copyAPIKey(keyCard: Locator) {
    const copyButton = keyCard.locator('button:has-text("Copy Now!")');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    
    // Just wait a moment for the copy operation to complete
    // The button text change might be too fast to catch reliably in tests
    await this.page.waitForTimeout(500);
  }

  async hideAPIKey(keyCard: Locator) {
    // Look for either "Hide Forever ⚠️" (new keys) or "Hide" (existing keys)
    const hideButton = keyCard.locator('button').filter({ hasText: /Hide/ });
    await expect(hideButton).toBeVisible();
    await hideButton.click();
    
    // After hiding, the key should become masked again (shows as sk_live_...xxx)
    await expect(keyCard.locator('code')).toContainText('...');
  }

  async revokeAPIKey(keyCard: Locator) {
    await keyCard.locator('button:has-text("Revoke")').click();
    await expect(keyCard.locator('text=revoked')).toBeVisible();
  }

  async deleteAPIKey(keyCard: Locator, keyName: string) {
    // Setup dialog handler for confirmation
    this.page.on('dialog', dialog => dialog.accept());
    
    await keyCard.locator('button:has-text("Delete")').click();
    
    // Verify key is removed
    await expect(this.page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: keyName })).not.toBeVisible();
  }
}

/**
 * Test utilities for chart interactions
 */
export class ChartHelper {
  constructor(private page: Page) {}

  async navigateToUsage() {
    await this.page.click('a[href="/usage"]');
    await expect(this.page).toHaveURL('/usage');
    await expect(this.page.locator('h1:has-text("Usage Metrics")')).toBeVisible();
  }

  async selectTimeFilter(filter: '1 Day' | '1 Week' | '30 Days') {
    await this.page.click(`button:has-text("${filter}")`);
    
    // Wait for charts to update
    await this.page.waitForTimeout(500);
  }

  async verifyChartTitle(expectedTitle: string) {
    await expect(this.page.locator(`text=${expectedTitle}`)).toBeVisible();
  }

  async verifyChartsVisible() {
    // Check that chart containers are visible
    await expect(this.page.locator('.recharts-wrapper')).toHaveCount(2);
  }
}

/**
 * Test utilities for dev toolbar
 */
export class DevToolbarHelper {
  constructor(private page: Page) {}

  async openDevToolbar() {
    // Dev toolbar should be visible if DEBUG_MODE is true
    const toolbar = this.page.locator('[data-testid="dev-toolbar"]');
    await expect(toolbar).toBeVisible();
    return toolbar;
  }

  async toggleFeatureFlag(flagName: string) {
    const toolbar = await this.openDevToolbar();
    const toggle = toolbar.locator(`input[type="checkbox"][id*="${flagName}"]`);
    await toggle.click();
  }

  async enableAllFeatures() {
    const toolbar = await this.openDevToolbar();
    await toolbar.locator('button:has-text("Enable All")').click();
  }

  async disableAllFeatures() {
    const toolbar = await this.openDevToolbar();
    await toolbar.locator('button:has-text("Disable All")').click();
  }

  async resetFeatures() {
    const toolbar = await this.openDevToolbar();
    await toolbar.locator('button:has-text("Reset")').click();
  }
}

/**
 * Test utilities for component interactions
 */
export class ComponentHelper {
  constructor(private page: Page) {}

  async verifyButton(text: string, variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary') {
    const button = this.page.locator(`button:has-text("${text}")`);
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    return button;
  }

  async verifyCard(content: string) {
    const card = this.page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: content });
    await expect(card).toBeVisible();
    return card;
  }

  async fillInput(label: string, value: string) {
    const input = this.page.locator(`input`).filter({ has: this.page.locator(`label:has-text("${label}")`) });
    await input.fill(value);
  }

  async verifyNavigation() {
    // Verify all navigation links are present
    const navLinks = ['Dashboard', 'API Keys', 'Usage', 'Docs'];
    
    for (const link of navLinks) {
      await expect(this.page.locator(`nav a:has-text("${link}")`)).toBeVisible();
    }
  }

  async verifyLayout() {
    // Verify main layout elements
    await expect(this.page.locator('header')).toBeVisible();
    await expect(this.page.locator('main')).toBeVisible();
    await expect(this.page.locator('text=Sandbox Console')).toBeVisible();
  }
}

/**
 * Wait utilities
 */
export class WaitHelper {
  constructor(private page: Page) {}

  async waitForChartLoad() {
    await this.page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    await this.page.waitForTimeout(1000); // Additional time for chart rendering
  }

  async waitForAPIResponse(url: string) {
    await this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200
    );
  }

  async waitForStateUpdate() {
    await this.page.waitForTimeout(500); // Wait for React state updates
  }
}