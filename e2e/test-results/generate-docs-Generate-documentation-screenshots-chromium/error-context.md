# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generate-docs.spec.ts >> Generate documentation screenshots
- Location: generate-docs.spec.ts:3:5

# Error details

```
Error: Login failed with message: "Failed to fetch". Make sure the database is seeded with ceo@example.com.
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Login" [level=2] [ref=e5]
  - paragraph [ref=e6]: Failed to fetch
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: Email
      - textbox [ref=e10]: ceo@example.com
    - generic [ref=e11]:
      - generic [ref=e12]: Password
      - textbox [ref=e13]: password123
    - button "Sign In" [active] [ref=e14] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Generate documentation screenshots', async ({ page }) => {
  4  |   const baseUrl = 'http://localhost:3914';
  5  |   
  6  |   // 1. Login
  7  |   await page.goto(`${baseUrl}/login`);
  8  |   await page.fill('input[type="email"]', 'ceo@example.com');
  9  |   await page.fill('input[type="password"]', 'password123');
  10 |   
  11 |   // Click and wait for navigation or error
  12 |   await page.click('button[type="submit"]');
  13 |   
  14 |   // If we stay on login, let's see why
  15 |   const error = page.locator('p[style*="color: var(--error)"]');
  16 |   if (await error.isVisible()) {
  17 |     const message = await error.innerText();
> 18 |     throw new Error(`Login failed with message: "${message}". Make sure the database is seeded with ceo@example.com.`);
     |           ^ Error: Login failed with message: "Failed to fetch". Make sure the database is seeded with ceo@example.com.
  19 |   }
  20 | 
  21 |   await expect(page).toHaveURL(`${baseUrl}/`, { timeout: 10000 });
  22 |   
  23 |   // Wait for content to load
  24 |   await page.waitForSelector('.card', { timeout: 10000 });
  25 |   await page.waitForTimeout(2000); // Wait for animations/rendering
  26 | 
  27 |   // 2. Dashboard - List View
  28 |   await page.screenshot({ path: '../docs/screenshots/dashboard-list.png', fullPage: true });
  29 | 
  30 |   // 3. Dashboard - Chart View
  31 |   const chartBtn = page.locator('button:has-text("Chart")');
  32 |   if (await chartBtn.isVisible()) {
  33 |     await chartBtn.click();
  34 |     await page.waitForTimeout(2000); // Wait for tree to render
  35 |     await page.screenshot({ path: '../docs/screenshots/dashboard-chart.png', fullPage: true });
  36 |   }
  37 | 
  38 |   // 4. Admin Panel
  39 |   await page.goto(`${baseUrl}/admin`);
  40 |   await page.waitForSelector('h2:has-text("Manage Positions")');
  41 |   await page.screenshot({ path: '../docs/screenshots/admin-panel.png', fullPage: true });
  42 | 
  43 |   // 5. User Editor (New User)
  44 |   await page.goto(`${baseUrl}/users/new`);
  45 |   await page.waitForSelector('h2:has-text("Create New User")');
  46 |   await page.screenshot({ path: '../docs/screenshots/user-editor.png', fullPage: true });
  47 | 
  48 |   console.log('Screenshots generated in docs/screenshots/');
  49 | });
  50 | 
```