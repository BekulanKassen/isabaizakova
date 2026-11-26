// Снимки сайта в ключевых точках прокрутки на ширине 1440 и 390 px.
// Поднимает свой маленький http-сервер над папкой site/, поэтому отдельный сервер не нужен.
//
//   npm i -D playwright
//   npx playwright install chromium
//   node tools/screenshots.mjs            -> папка shots/
//
// GSAP и шрифты грузятся из интернета (cdnjs, Google Fonts), без сети эффекты не включатся.
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../site/', import.meta.url));
const OUT = fileURLToPath(new URL('../shots/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
await mkdir(OUT, { recursive: true });

const points = {
  hero: () => 0,
  afisha: () => document.querySelector('#afisha').offsetTop - 40,
  collectives: () => document.querySelector('#ujymdar').offsetTop + 40,
  'hall-arch-start': () => document.querySelector('.hall-intro').getBoundingClientRect().top + scrollY,
  'hall-arch-open': () => document.querySelector('.hall-intro').getBoundingClientRect().top + scrollY + 1100,
  chapters: () => document.querySelector('.ch[data-i="2"]').getBoundingClientRect().top + scrollY - 200,
  '85': () => document.querySelector('.y85').getBoundingClientRect().top + scrollY + 60,
  timeline: () => document.querySelector('#tl').getBoundingClientRect().top + scrollY + 500,
  visit: () => document.querySelector('#kelushilerge').getBoundingClientRect().top + scrollY - 40,
};

const browser = await chromium.launch();
for (const [tag, viewport] of [['1440', { width: 1440, height: 900 }], ['390', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (e) => console.log('page error:', e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2800); // вход главного экрана
  for (const [name, fn] of Object.entries(points)) {
    await page.evaluate(`scrollTo(0, (${fn})())`);
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(OUT, `${tag}-${name}.png`) });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(`${tag}px: ${overflow ? 'ЕСТЬ горизонтальная прокрутка' : 'без горизонтальной прокрутки'}`);
  await page.close();
}
await browser.close();
server.close();
console.log('Снимки в', OUT);
