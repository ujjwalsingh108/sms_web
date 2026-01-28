import { test, expect } from '@playwright/test';

// Placeholder: Playwright can exercise HTTP endpoints via `request`.
// These tests are scaffolds; run after installing Playwright.

test.describe('API CRUD scaffolds', () => {
  test('GET /api/academic-years returns 200', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/api/academic-years`);
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);
  });
});
