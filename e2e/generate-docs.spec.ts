import { test, expect } from '@playwright/test';

test('Generate documentation screenshots', async ({ page }) => {
  const baseUrl = 'http://localhost:3914';
  
  // 1. Login
  await page.goto(`${baseUrl}/login`);
  await page.fill('input[type="email"]', 'ceo@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await expect(page).toHaveURL(`${baseUrl}/`);
  await page.waitForSelector('.org-node-container', { timeout: 5000 }).catch(() => {}); // Wait for chart if it was active
  await page.waitForSelector('.card', { timeout: 5000 });

  // 2. Dashboard - List View
  await page.click('button:has-text("List")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '../docs/screenshots/dashboard-list.png', fullPage: true });

  // 3. Dashboard - Chart View
  await page.click('button:has-text("Chart")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '../docs/screenshots/dashboard-chart.png', fullPage: true });

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
