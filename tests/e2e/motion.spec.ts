import { expect, test } from '@playwright/test';

test('reduced motion: no GSAP effects, history stays a grid', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/kk/');
  await page.waitForTimeout(500);
  await expect(page.locator('#tl')).not.toHaveClass(/tl-h/);
  expect(await page.locator('#arch').evaluate((el) => getComputedStyle(el).clipPath)).toBe('none');
  expect(await page.evaluate(() => 'gsapReady' in document.documentElement.dataset)).toBe(false);
  await ctx.close();
});

test('desktop: the arch opens as you scroll and nothing logs errors', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/kk/');
  await expect(page.locator('html')).toHaveAttribute('data-gsap-ready', '');
  await expect(page.locator('#tl')).toHaveClass(/tl-h/);
  const top = await page.locator('.hall-intro').evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y + 10), top);
  await page.waitForTimeout(800);
  const start = await page.locator('#arch').evaluate((el) => getComputedStyle(el).clipPath);
  await page.evaluate((y) => scrollTo(0, y + 900), top);
  await page.waitForTimeout(1200);
  const end = await page.locator('#arch').evaluate((el) => getComputedStyle(el).clipPath);
  expect(start).not.toBe(end);
  expect(errors).toEqual([]);
  await ctx.close();
});
