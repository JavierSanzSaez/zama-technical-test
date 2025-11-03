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
  }

  async logout() {
    await this.page.click('button:has-text("Logout")');
    // After logout, should redirect to login page
    await expect(this.page).toHaveURL('/login');
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
    
    // Wait for modal to appear
    await expect(this.page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    await expect(this.page.locator('h2:has-text("Create New API Key")')).toBeVisible();
    
    // Wait for form to appear
    await expect(this.page.locator('input[placeholder*="Production API Key"]')).toBeVisible();
    
    // Fill key name
    await this.page.fill('input[placeholder*="Production API Key"]', name);
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for success message in modal
    await expect(this.page.locator('text=API Key Created Successfully!')).toBeVisible();
    
    // Return a selector function that can find the key after modal is closed
    return {
      name,
      findCard: () => {
        // Find the API key card by looking for the outermost container that contains the key name
        // We need to find the parent container that includes the name, status, key value, and buttons
        return this.page.locator('.text-lg.font-semibold.text-mono-50').filter({ hasText: name }).locator('../../..');
      }
    };
  }

  async closeCreateModal() {
    // Click "I've Saved My Key" button to close the modal
    const closeButton = this.page.locator('button:has-text("I\'ve Saved My Key")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // Wait for modal to disappear
    await expect(this.page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
  }

  async revokeAPIKey(keyCard: Locator) {
    await keyCard.locator('button:has-text("Revoke")').click();
    
    // Wait for revoke confirmation modal
    await expect(this.page.locator('h3:has-text("Revoke API Key")')).toBeVisible();
    await expect(this.page.locator('text=This will immediately disable the key')).toBeVisible();
    
    // Confirm revocation
    await this.page.click('button:has-text("Revoke Key")');
    
    // Wait for modal to close and key to be updated
    await expect(this.page.locator('h3:has-text("Revoke API Key")')).not.toBeVisible();
    await this.page.waitForTimeout(500);
  }

  async deleteAPIKey(keyCard: Locator, keyName: string) {
    await keyCard.locator('button:has-text("Delete")').click();
    
    // Wait for delete confirmation modal
    await expect(this.page.locator('h3:has-text("Delete API Key")')).toBeVisible();
    await expect(this.page.locator(`text=delete the API key "${keyName}"`)).toBeVisible();
    await expect(this.page.locator('text=This action cannot be undone')).toBeVisible();
    
    // Confirm deletion
    await this.page.click('button:has-text("Delete Key")');
    
    // Wait for modal to close and verify key is removed
    await expect(this.page.locator('h3:has-text("Delete API Key")')).not.toBeVisible();
    // Check that the key name is no longer visible in the page
    await expect(this.page.locator('div').filter({ hasText: keyName })).not.toBeVisible();
  }

  async regenerateAPIKey(keyCard: Locator) {
    await keyCard.locator('button:has-text("Regenerate")').click();
    
    // Wait for regenerated key notification to appear
    await expect(this.page.locator('text=API Key Regenerated Successfully!')).toBeVisible();
    await expect(this.page.locator('text=This is your only chance to copy the new key!')).toBeVisible();
    
    // Wait for countdown to start
    await expect(this.page.locator('text=The API Key will mask itself in')).toBeVisible();
  }

  async copyRegeneratedKey() {
    // Copy the regenerated key
    const copyButton = this.page.locator('button:has-text("Copy Now!")');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    
    // Wait for the copy action to complete - the button doesn't change text but may show visual feedback
    // We can verify the copy was successful by checking that the button is still present and clickable
    await this.page.waitForTimeout(1000);
    
    // Verify the copy button is still there (indicating the copy action completed)
    await expect(copyButton).toBeVisible();
  }

  async hideRegeneratedKey() {
    // Click "Hide Forever" button to hide the regenerated key
    const hideButton = this.page.locator('button:has-text("Hide Forever")');
    await expect(hideButton).toBeVisible();
    await hideButton.click();
    
    // Wait for regenerated key notification to disappear
    await expect(this.page.locator('text=API Key Regenerated Successfully!')).not.toBeVisible();
  }

  async cancelRevokeModal() {
    // Click Cancel in revoke confirmation modal
    await this.page.click('button:has-text("Cancel")');
    
    // Wait for modal to close
    await expect(this.page.locator('h3:has-text("Revoke API Key")')).not.toBeVisible();
  }

  async cancelDeleteModal() {
    // Click Cancel in delete confirmation modal
    await this.page.click('button:has-text("Cancel")');
    
    // Wait for modal to close
    await expect(this.page.locator('h3:has-text("Delete API Key")')).not.toBeVisible();
  }

  async verifyKeyStatus(keyCard: Locator, expectedStatus: 'active' | 'revoked') {
    // Use a more specific selector for the status badge within the card
    const statusBadge = keyCard.locator('span.inline-block.px-3.py-1.rounded-full').filter({ hasText: expectedStatus });
    await expect(statusBadge).toBeVisible();
  }

  async verifyActionButtons(keyCard: Locator, expectedButtons: string[]) {
    for (const buttonText of expectedButtons) {
      await expect(keyCard.locator(`button:has-text("${buttonText}")`)).toBeVisible();
    }
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