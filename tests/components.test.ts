import { test, expect } from '@playwright/test';
import { AuthHelper, ComponentHelper } from './utils/helpers';
import { mockUser, testSelectors } from './fixtures/testData';

test.describe('Button Component', () => {
  let authHelper: AuthHelper;
  let componentHelper: ComponentHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    componentHelper = new ComponentHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should render primary button correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // Test primary button styling and interactions
    const button = await componentHelper.verifyButton('Create New Key', 'primary');
    
    // Verify button styling classes (primary button uses blue, not yellow)
    await expect(button).toHaveClass(/bg-blue-600/);
    await expect(button).toHaveClass(/text-white/);
    
    // Test hover state (button uses blue hover, not yellow)
    await button.hover();
    await expect(button).toHaveClass(/hover:bg-blue-700/);
  });

  test('should render secondary button correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // Look for secondary buttons (Regenerate, Revoke)
    const secondaryButton = page.locator('button:has-text("Regenerate")').first();
    if (await secondaryButton.isVisible()) {
      await expect(secondaryButton).toHaveClass(/bg-gray-700/);
      await expect(secondaryButton).toHaveClass(/text-gray-100/);
    }
  });

  test('should render ghost button correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Logout button is ghost variant
    const ghostButton = page.locator(testSelectors.logoutButton);
    await expect(ghostButton).toBeVisible();
    await expect(ghostButton).toHaveClass(/bg-transparent/);
  });

  test('should render danger button correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // Look for delete buttons
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toHaveClass(/bg-red-600/);
      await expect(deleteButton).toHaveClass(/text-white/);
    }
  });

  test('should handle button clicks correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // Test create button click
    await page.click(testSelectors.createKeyButton);
    await expect(page.locator('text=Create Key')).toBeVisible();
    
    // Test cancel button
    await page.click('button:has-text("Cancel")');
    await expect(page.locator(testSelectors.keyNameInput)).not.toBeVisible();
  });

  test('should show disabled state correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // Create a key to test disabled state
    await page.click(testSelectors.createKeyButton);
    const submitButton = page.locator('button[type="submit"]');
    
    // Button should be disabled when form is empty
    await expect(submitButton).toBeDisabled();
    
    // Fill form and button should be enabled
    await page.fill(testSelectors.keyNameInput, 'Test Key');
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Card Component', () => {
  let authHelper: AuthHelper;
  let componentHelper: ComponentHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    componentHelper = new ComponentHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should render cards with correct styling', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Verify card elements are present
    const cards = page.locator('.bg-white.rounded-lg.shadow-md');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Test card styling
    const firstCard = cards.first();
    await expect(firstCard).toHaveClass(/bg-white/);
    await expect(firstCard).toHaveClass(/rounded-lg/);
  });

  test('should handle hover effects on interactive cards', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find cards with hover effects
    const interactiveCards = page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: 'API Keys' });
    if (await interactiveCards.count() > 0) {
      const card = interactiveCards.first();
      await card.hover();
      // Hover effects should be applied (card uses hover:shadow-lg)
      await expect(card).toHaveClass(/hover:shadow-lg/);
    }
  });

  test('should display card content correctly', async ({ page }) => {
    await page.goto('/api-keys');
    
    // If there are API keys, verify card content
    const keyCards = page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: 'API Key' });
    if (await keyCards.count() > 0) {
      const firstKeyCard = keyCards.first();
      
      // Should contain key name
      await expect(firstKeyCard.locator('.text-lg.font-semibold')).toBeVisible();
      
      // Should contain creation date
      await expect(firstKeyCard.locator('text=Created:')).toBeVisible();
      
      // Should contain status badge
      await expect(firstKeyCard.locator('.rounded-full')).toBeVisible();
    }
  });
});

test.describe('Input Component', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
  });

  test('should render input with label correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test email input
    const emailLabel = page.locator('label:has-text("Email")');
    const emailInput = page.locator(testSelectors.emailInput);
    
    await expect(emailLabel).toBeVisible();
    await expect(emailInput).toBeVisible();
    // Input uses light theme styling
    await expect(emailInput).toHaveClass(/border-gray-300/);
    await expect(emailInput).toHaveClass(/focus:border-blue-500/);
  });

  test('should show focus states correctly', async ({ page }) => {
    await page.goto('/');
    
    const emailInput = page.locator(testSelectors.emailInput);
    await emailInput.focus();
    
    // Should have focus styling (blue theme, not yellow)
    await expect(emailInput).toHaveClass(/focus:ring-blue-500/);
    await expect(emailInput).toHaveClass(/focus:border-blue-500/);
  });

  test('should handle input validation', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await page.goto('/api-keys');
    
    // Open create form
    await page.click(testSelectors.createKeyButton);
    
    const keyInput = page.locator(testSelectors.keyNameInput);
    const submitButton = page.locator('button[type="submit"]');
    
    // Empty input should disable submit
    await expect(submitButton).toBeDisabled();
    
    // Valid input should enable submit
    await keyInput.fill('Test API Key');
    await expect(submitButton).toBeEnabled();
    
    // Clear input should disable again
    await keyInput.fill('');
    await expect(submitButton).toBeDisabled();
  });

  test('should display placeholder text', async ({ page }) => {
    await authHelper.login(mockUser.email);
    await page.goto('/api-keys');
    
    await page.click(testSelectors.createKeyButton);
    const keyInput = page.locator(testSelectors.keyNameInput);
    
    await expect(keyInput).toHaveAttribute('placeholder', expect.stringContaining('Production API Key'));
  });
});

test.describe('Layout Component', () => {
  let authHelper: AuthHelper;
  let componentHelper: ComponentHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    componentHelper = new ComponentHelper(page);
    await authHelper.login(mockUser.email);
  });

  test('should render layout elements correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    await componentHelper.verifyLayout();
    
    // Verify light theme styling (app uses light theme, not dark)
    const header = page.locator('header');
    await expect(header).toHaveClass(/bg-white/);
  });

  test('should display navigation correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    await componentHelper.verifyNavigation();
    
    // Verify navigation styling (active link has blue color)
    const navLinks = page.locator('nav a');
    await expect(navLinks.first()).toHaveClass(/text-blue-600/);
  });

  test('should show active navigation state', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dashboard link should be active (uses blue colors, not yellow)
    const dashboardLink = page.locator('nav a[href="/dashboard"]');
    await expect(dashboardLink).toHaveClass(/text-blue-600/);
    await expect(dashboardLink).toHaveClass(/font-semibold/);
  });

  test('should display user email in header', async ({ page }) => {
    await page.goto('/dashboard');
    
    // User email should be visible in header
    await expect(page.locator(`text=${mockUser.email}`)).toBeVisible();
  });

  test('should show logo with correct styling', async ({ page }) => {
    await page.goto('/dashboard');
    
    const logo = page.locator('text=Sandbox Console');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/text-blue-600/);
    await expect(logo).toHaveClass(/text-2xl/);
    await expect(logo).toHaveClass(/font-bold/);
  });

  test('should handle navigation between pages', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to API Keys
    await page.click(testSelectors.apiKeysLink);
    await expect(page).toHaveURL('/api-keys');
    
    // API Keys link should now be active (has text-blue-600 and font-semibold)
    const apiKeysLink = page.locator('nav a[href="/api-keys"]');
    await expect(apiKeysLink).toHaveClass(/text-blue-600/);
    await expect(apiKeysLink).toHaveClass(/font-semibold/);
    
    // Navigate to Usage
    await page.click(testSelectors.usageLink);
    await expect(page).toHaveURL('/usage');
    
    // Navigate to Docs
    await page.click(testSelectors.docsLink);
    await expect(page).toHaveURL('/docs');
  });

  test('should handle logout functionality', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click logout
    await authHelper.logout();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });
});