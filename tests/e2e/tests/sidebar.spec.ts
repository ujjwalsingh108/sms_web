import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const statePath = path.resolve(__dirname, '..', 'state.json');
const hasAuth = fs.existsSync(statePath);

const pages = [
  '/dashboard/academic',
  '/dashboard/staff',
  '/dashboard/students',
  '/dashboard/transport',
  '/dashboard/attendance',
  '/dashboard/exams',
  '/dashboard/fees',
  '/dashboard/library',
  '/dashboard/inventory',
  '/dashboard/timetable',
  '/dashboard/hostel',
  '/dashboard/infirmary',
  '/dashboard/accounts',
];

for (const p of pages) {
  test.describe(p, () => {
    test(p + ' loads', async ({ page, baseURL }) => {
      if (!hasAuth) test.skip('No storageState; set E2E_EMAIL/E2E_PASSWORD to run authenticated tests');
      await page.goto(baseURL + p);
      // basic smoke check: prefer the main region, fall back to headings — assert first match is visible
      const root = page.locator('main, [role=main], h1, h2').first();
      await expect(root).toBeVisible({ timeout: 5000 });
    });
  });
}
