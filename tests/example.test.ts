import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/');
    
    // Basic page load test
    await expect(page).toHaveTitle(/Zama API Dashboard/i);
    
    // Check for basic elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should perform basic login', async ({ page }) => {
    await page.goto('/');
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});