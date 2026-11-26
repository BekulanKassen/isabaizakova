import { expect, test } from '@playwright/test';

const FX = 'http://127.0.0.1:4401';
const pages = ['/kk/', '/ru/', '/kk/afisha/', '/ru/afisha/'];
const fixturePages = [FX + '/kk/', FX + '/kk/afisha/', FX + '/ru/afisha/', FX + '/kk/news/season-85-opening/'];

for (const width of [320, 390, 1440]) {
  for (const url of [...pages, ...fixturePages]) {
    test(`no sideways scroll at ${width}px: ${url}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 844 } });
      const page = await ctx.newPage();
      await page.clock.setFixedTime(new Date('2026-12-01T10:00:00+05:00'));
      await page.goto(url);
      await page.waitForTimeout(300);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(over).toBeLessThanOrEqual(0);
      await ctx.close();
    });
  }
}

for (const width of [320, 390]) {
  for (const lang of ['kk', 'ru']) {
    test(`concert titles fit their cell at ${width}px (${lang})`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(`${FX}/${lang}/afisha/`);
      const bad = await page.locator('.ev-t h3, .ev-t p').evaluateAll((els) =>
        els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent));
      expect(bad).toEqual([]);
      await ctx.close();
    });
  }
}
