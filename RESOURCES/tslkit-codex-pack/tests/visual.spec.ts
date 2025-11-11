import { test, expect } from '@playwright/test';

test('home (desktop)', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'http://localhost:5173', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'artifacts/screens/home-desktop.png', fullPage: true });
  await expect(page.locator('header, nav, main')).toHaveCount(3);
});

test('home (mobile)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(process.env.APP_URL ?? 'http://localhost:5173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'artifacts/screens/home-mobile.png', fullPage: true });
});
