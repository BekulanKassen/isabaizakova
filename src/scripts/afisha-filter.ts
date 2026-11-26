// Afisha in the browser: hide concerts that are already over, filter by genre, keep the count right.
import { countLabel } from '../lib/afisha';
import { todayInPavlodar } from '../lib/dates';
import type { Lang } from '../i18n/ui';

const rows = (root: ParentNode) => Array.from(root.querySelectorAll<HTMLElement>('.ev'));
const has = (r: HTMLElement, g: string) => (r.dataset.g ?? '').split(' ').includes(g);
const past = (r: HTMLElement) => r.dataset.past === '1';

function refresh(root: HTMLElement, genre: string): void {
  rows(root).forEach((r) => { r.hidden = past(r) || !(genre === 'all' || has(r, genre)); });
  root.querySelectorAll<HTMLElement>('.ev-group').forEach((g) => { g.hidden = rows(g).every((r) => r.hidden); });
  const n = rows(root).filter((r) => !r.hidden).length;
  const count = root.querySelector<HTMLElement>('#ev-count');
  if (count) count.textContent = countLabel(n, (count.dataset.lang as Lang) ?? 'kk');
  const empty = root.querySelector<HTMLElement>('.ev-filter-empty');
  if (empty) empty.hidden = n > 0;
}

export function hidePast(root: HTMLElement, today: string): void {
  rows(root).forEach((r) => { if ((r.dataset.date ?? '') < today) r.dataset.past = '1'; });
  refresh(root, 'all');
}

export function initFilter(root: HTMLElement): void {
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('.chip'));
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    refresh(root, c.dataset.g ?? 'all');
    (window as unknown as { ScrollTrigger?: { refresh(): void } }).ScrollTrigger?.refresh();
  }));
}

export function initAfisha(): void {
  const root = document.getElementById('afisha');
  if (!root || !root.querySelector('.ev')) return;
  hidePast(root, todayInPavlodar());
  initFilter(root);
}
