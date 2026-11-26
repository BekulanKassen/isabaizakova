import { expect, test } from '@playwright/test';

const FX = 'http://127.0.0.1:4401';

test('kk home: title, language switch, empty afisha', async ({ page }) => {
  await page.goto('/kk/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.locator('h1')).toContainText('Иса Байзақов');
  await expect(page.locator('.head .lang a[aria-current="true"]')).toHaveText('ҚАЗ');
  await expect(page.locator('.head .lang a', { hasText: 'РУС' })).toHaveAttribute('href', '/ru/');
  await expect(page.locator('#afisha .ev')).toHaveCount(0);
  await expect(page.locator('#afisha .ev-empty')).toContainText('Freedom Ticketon');
  await expect(page.locator('.next')).toHaveCount(0);
  await expect(page.locator('#afisha .chip')).toHaveCount(0);
});

test('ru home has Russian text', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('h1')).toContainText('имени Исы Байзакова');
  await expect(page.locator('.head .lang a', { hasText: 'ҚАЗ' })).toHaveAttribute('href', '/kk/');
});

test('root redirects to kk', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/kk\/$/);
});

test.describe('with a fixture afisha', () => {
  test('genre filter shows only matching rows and updates the count', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-01T10:00:00+05:00'));
    await page.goto(FX + '/ru/');
    await page.locator('#afisha .chip', { hasText: 'Джаз' }).click();
    const visible = page.locator('#afisha .ev:visible');
    await expect(visible).toHaveCount(2);
    for (const g of await visible.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.g))) expect(g).toContain('jazz');
    await expect(page.locator('#ev-count')).toHaveText('2 концерта');
  });

  test('next concert card and sample mark', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-01T10:00:00+05:00'));
    await page.goto(FX + '/kk/');
    await expect(page.locator('.next')).toContainText('05');
    await expect(page.locator('#afisha .ev').first()).toContainText('мысал');
  });

  test('past events are hidden in the browser', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-14T10:00:00+05:00'));
    await page.goto(FX + '/kk/');
    for (const d of ['2026-12-05', '2026-12-06', '2026-12-12', '2026-12-13']) await expect(page.locator(`#afisha .ev[data-date="${d}"]`)).toBeHidden();
    await expect(page.locator('#afisha .ev[data-date="2026-12-19"]')).toBeVisible();
  });

  test('a genre whose concerts are all over loses its chip', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-14T10:00:00+05:00'));
    await page.goto(FX + '/ru/');
    await expect(page.locator('#afisha .chip', { hasText: 'Детям' })).toBeHidden();
    await expect(page.locator('#afisha .chip', { hasText: 'Джаз' })).toBeVisible();
  });

  test('when every concert is over the page says so instead of showing stale data', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-03-01T10:00:00+05:00'));
    await page.goto(FX + '/kk/');
    await expect(page.locator('.next')).toBeHidden();
    await expect(page.locator('.hero-grid')).toHaveClass(/solo/);
    await expect(page.locator('#afisha .month')).toBeHidden();
    await expect(page.locator('#afisha .chips')).toBeHidden();
    await expect(page.locator('#afisha .ev-filter-empty')).toBeHidden();
    await expect(page.locator('#afisha .ev-empty')).toBeVisible();
    await expect(page.locator('#afisha .ev-empty')).toContainText('Freedom Ticketon');
  });

  test('a next-concert card that is over is hidden', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-06T10:00:00+05:00'));
    await page.goto(FX + '/kk/');
    await expect(page.locator('.next')).toBeHidden();
  });

  test('without JavaScript every event is visible', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(FX + '/kk/');
    await expect(page.locator('#afisha .ev:visible')).toHaveCount(7);
    await ctx.close();
  });
});
