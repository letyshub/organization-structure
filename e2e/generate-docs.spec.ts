import { test, expect } from '@playwright/test';

test('Generate documentation screenshots', async ({ page }) => {
  const baseUrl = 'http://localhost:3914';
  
  // 1. Login
  await page.goto(`${baseUrl}/login`);
  await page.fill('input[type="email"]', 'ceo@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Click and wait for navigation or error
  await page.click('button[type="submit"]');
  
  // If we stay on login, let's see why
  const error = page.locator('p[style*="color: var(--error)"]');
  if (await error.isVisible()) {
    const message = await error.innerText();
    throw new Error(`Login failed with message: "${message}". Make sure the database is seeded with ceo@example.com.`);
  }

  await expect(page).toHaveURL(`${baseUrl}/`, { timeout: 10000 });
  
  // Wait for content to load
  await page.waitForSelector('.card', { timeout: 10000 });
  await page.waitForTimeout(2000); // Wait for animations/rendering

  // 2. Dashboard - List View
  await page.screenshot({ path: '../docs/screenshots/dashboard-list.png', fullPage: true });

  // 3. Dashboard - Chart View
  const chartBtn = page.locator('button:has-text("Chart")');
  if (await chartBtn.isVisible()) {
    await chartBtn.click();
    await page.waitForTimeout(2000); // Wait for tree to render
    await page.screenshot({ path: '../docs/screenshots/dashboard-chart.png', fullPage: true });
  }

  // 4. Admin Panel
  await page.goto(`${baseUrl}/admin`);
  await page.waitForSelector('h2:has-text("Manage Positions")');
  await page.screenshot({ path: '../docs/screenshots/admin-panel.png', fullPage: true });

  // 5. User Editor (New User)
  await page.goto(`${baseUrl}/users/new`);
  await page.waitForSelector('h2:has-text("Create New User")');
  await page.screenshot({ path: '../docs/screenshots/user-editor.png', fullPage: true });

  console.log('Screenshots generated in docs/screenshots/');
});
