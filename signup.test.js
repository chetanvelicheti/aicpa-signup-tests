const { test, expect } = require('@playwright/test');

test.describe('AICPA-CIMA Signup Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('https://www.aicpa-cima.com/home');
  });

  test('TC01: Successful Signup', async ({ page }) => {
    // Assuming there's a "Sign Up" link on the homepage
    await page.click('text=Sign Up'); // Adjust selector based on actual site
    await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`); // Unique email
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!'); // If applicable
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Welcome')).toBeVisible(); // Adjust success indicator
  });

  test('TC02: Signup with Existing Email', async ({ page }) => {
    await page.click('text=Sign Up');
    await page.fill('input[name="email"]', 'existinguser@example.com'); // Replace with a real registered email
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email already in use')).toBeVisible(); // Adjust error message
  });

  test('TC03: Signup with Invalid Email', async ({ page }) => {
    await page.click('text=Sign Up');
    await page.fill('input[name="email"]', 'invalid-email@');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email format')).toBeVisible(); // Adjust error message
  });

  test('TC04: Signup with Weak Password', async ({ page }) => {
    await page.click('text=Sign Up');
    await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`);
    await page.fill('input[name="password"]', '123'); // Weak password
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password too weak')).toBeVisible(); // Adjust error message
  });

  test('TC05: Mandatory Fields Validation', async ({ page }) => {
    await page.click('text=Sign Up');
    await page.click('button[type="submit"]'); // Submit without filling fields
    await expect(page.locator('text=Required fields missing')).toBeVisible(); // Adjust error message
  });
});
