import { expect, test } from '@playwright/test';

const FX = 'http://127.0.0.1:4401';
test.beforeEach(async ({ page }) => { await page.clock.setFixedTime(new Date('2026-12-01T10:00:00+05:00')); });

test('afisha page groups concerts by month with ticket links', async ({ page }) => {
  await page.goto(FX + '/ru/afisha/');
  await expect(page.locator('h1')).toHaveText('Афиша');
  await expect(page.locator('.month-sub')).toHaveText(['Декабрь 2026', 'Январь 2027']);
  await expect(page.locator('.ev')).toHaveCount(8);
  for (const a of await page.locator('.ev a.btn').all()) {
    await expect(a).toHaveAttribute('href', /^https:\/\/ticketon\.kz\//);
    await expect(a).toHaveAttribute('target', '_blank');
  }
});

test('home shows at most 7 concerts and links to the full afisha', async ({ page }) => {
  await page.goto(FX + '/kk/');
  await expect(page.locator('#afisha .ev')).toHaveCount(7);
  await expect(page.locator('#afisha a[href="/kk/afisha/"]')).toHaveCount(1);
});

test('empty afisha page in the real build', async ({ page }) => {
  await page.goto('/kk/afisha/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.locator('.ev-empty')).toBeVisible();
  await expect(page.locator('.head .lang a', { hasText: 'РУС' })).toHaveAttribute('href', '/ru/afisha/');
});

test('a news item with text gets its own page in both languages', async ({ page }) => {
  await page.goto(FX + '/kk/');
  await page.locator('#news a.post').first().click();
  await expect(page).toHaveURL(/\/kk\/news\/season-85-opening\/$/);
  await expect(page.locator('h1')).toContainText('85-мерейтойлық');
  await expect(page.locator('article p')).toHaveCount(2);
  await page.locator('.head .lang a', { hasText: 'РУС' }).click();
  await expect(page).toHaveURL(/\/ru\/news\/season-85-opening\/$/);
  await expect(page.locator('h1')).toContainText('Юбилейный');
});

test('news without text are not links in the real build', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.locator('#news a.post')).toHaveCount(0);
  await expect(page.locator('#news article.post')).toHaveCount(3);
});
