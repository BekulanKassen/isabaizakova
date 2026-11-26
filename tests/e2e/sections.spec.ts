import { expect, test } from '@playwright/test';

for (const lang of ['kk', 'ru'] as const) {
  test(`${lang}: all home sections are present`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    await expect(page.locator('#ujymdar .col')).toHaveCount(8);
    await expect(page.locator('#zal .ch')).toHaveCount(4);
    await expect(page.locator('#tarih .yr')).toHaveCount(6);
    await expect(page.locator('#news .post')).toHaveCount(3);
    await expect(page.locator('#kelushilerge')).toContainText('68-02-94');
    await expect(page.locator('#kelushilerge a[href="tel:+77182228087"]')).toHaveCount(1);
    await expect(page.locator('#kelushilerge a[href="mailto:isa.baizakov2012@yandex.kz"]')).toHaveCount(1);
    await expect(page.locator('footer.foot')).toContainText(lang === 'kk' ? 'Павлодар облыстық' : 'Павлодарская областная');
  });
}

test('no link on the page points to a placeholder anchor', async ({ page }) => {
  await page.goto('/kk/');
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  for (const h of hrefs) {
    if (h === '#') throw new Error('bare # link');
    await expect(page.locator(h), `target of ${h}`).toHaveCount(1);
  }
});
