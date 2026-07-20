import { test, expect } from '@playwright/test';

const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@example.com`,
  username: `testuser_${Date.now()}`,
  password: 'TestPass123!',
};

test.describe('Authentication Flow', () => {
  test('should redirect to login page on root visit', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should show login form elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Welcome back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should show register form elements', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h2')).toContainText('Create an account');
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Choose a username"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account');
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Create account');
    await expect(page).toHaveURL('/register');
  });

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/register');
    await page.click('text=Sign in');
    await expect(page).toHaveURL('/login');
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[placeholder="John Doe"]', TEST_USER.name);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[placeholder="Choose a username"]', TEST_USER.username);
    
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(TEST_USER.password);
    await passwordInputs.nth(1).fill(TEST_USER.password);

    await page.click('.checkbox-label');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-alert')).toBeVisible({ timeout: 5000 });
  });

  test('should show error on empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.click('.password-toggle');
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.click('.password-toggle');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Dashboard (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should display dashboard with greeting', async ({ page }) => {
    const greeting = page.locator('.hero-greeting h1');
    await expect(greeting).toBeVisible();
    await expect(greeting).toContainText('Good');
  });

  test('should display balance card', async ({ page }) => {
    await expect(page.locator('.balance-card')).toBeVisible();
    await expect(page.locator('.balance-label')).toContainText('Total Balance');
  });

  test('should display stat cards (Income, Expenses, Savings)', async ({ page }) => {
    await expect(page.locator('.income-card')).toBeVisible();
    await expect(page.locator('.expense-card')).toBeVisible();
    await expect(page.locator('.savings-card')).toBeVisible();
  });

  test('should toggle balance visibility', async ({ page }) => {
    const balanceAmount = page.locator('.balance-amount');
    const initialText = await balanceAmount.textContent();

    await page.click('.visibility-toggle');
    await expect(balanceAmount).toContainText('••••••');

    await page.click('.visibility-toggle');
    await expect(balanceAmount).toContainText('$');
  });

  test('should have quick action buttons', async ({ page }) => {
    const quickActions = page.locator('.quick-action');
    await expect(quickActions).toHaveCount(4);
    await expect(quickActions.nth(0)).toContainText('Send');
    await expect(quickActions.nth(1)).toContainText('Request');
    await expect(quickActions.nth(2)).toContainText('Top Up');
    await expect(quickActions.nth(3)).toContainText('QR Pay');
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should navigate to wallet page', async ({ page }) => {
    await page.click('text=Top Up');
    await expect(page).toHaveURL('/wallet');
  });

  test('should navigate to transfer page', async ({ page }) => {
    await page.click('text=Send');
    await expect(page).toHaveURL('/transfer');
  });

  test('should navigate to transactions page', async ({ page }) => {
    await page.click('text=View All');
    await expect(page).toHaveURL('/transactions');
  });

  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.locator('h1')).toContainText('404');
  });
});
