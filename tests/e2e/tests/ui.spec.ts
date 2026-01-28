import { test, expect } from '@playwright/test';

test.describe('UI smoke tests (placeholders)', () => {
  test('Academic Management page loads', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard/academic`);
    await expect(page.locator('text=Academic Management')).toBeVisible();
  });
});
