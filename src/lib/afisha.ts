import type { Lang } from '../i18n/ui';
import type { Event } from './schema';

const key = (e: Event) => `${e.date}T${e.time}`;

export function upcoming(events: Event[], today: string): Event[] {
  return events.filter((e) => e.date >= today).sort((a, b) => key(a).localeCompare(key(b)));
}

export function nextConcert(events: Event[], today: string): Event | undefined {
  return upcoming(events, today)[0];
}

export function byMonth(events: Event[]): { ym: string; events: Event[] }[] {
  const out: { ym: string; events: Event[] }[] = [];
  for (const e of [...events].sort((a, b) => key(a).localeCompare(key(b)))) {
    const ym = e.date.slice(0, 7);
    const last = out[out.length - 1];
    if (last?.ym === ym) last.events.push(e);
    else out.push({ ym, events: [e] });
  }
  return out;
}

export function countLabel(n: number, lang: Lang): string {
  if (lang === 'kk') return `${n} концерт`;
  const m10 = n % 10, m100 = n % 100;
  const word = m10 === 1 && m100 !== 11 ? 'концерт' : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? 'концерта' : 'концертов';
  return `${n} ${word}`;
}

export function priceLabel(n: number, lang: Lang): string {
  if (n === 0) return lang === 'kk' ? 'Кіру тегін' : 'Вход свободный';
  const s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return lang === 'kk' ? `${s} ₸-ден` : `от ${s} ₸`;
}
