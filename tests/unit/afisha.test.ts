import { describe, expect, it } from 'vitest';
import { byMonth, countLabel, nextConcert, priceLabel, upcoming } from '../../src/lib/afisha';
import type { Event } from '../../src/lib/schema';

const ev = (id: string, date: string, time = '18:00'): Event => ({
  id, date, time, title: { kk: id, ru: id }, ensemble: { kk: 'x', ru: 'x' },
  genres: ['sym'], priceFrom: 1000, ticketUrl: 'https://ticketon.kz/', image: 'seats.webp',
});

describe('upcoming', () => {
  const list = [ev('c', '2026-12-20'), ev('a', '2026-12-13', '23:00'), ev('old', '2026-12-12'), ev('b', '2026-12-13', '12:00')];
  it('keeps today and later, sorted by date and time', () => {
    expect(upcoming(list, '2026-12-13').map((e) => e.id)).toEqual(['b', 'a', 'c']);
  });
  it('nextConcert is the first upcoming', () => {
    expect(nextConcert(list, '2026-12-13')?.id).toBe('b');
    expect(nextConcert([], '2026-12-13')).toBeUndefined();
  });
});

describe('byMonth', () => {
  it('groups in order', () => {
    const g = byMonth([ev('a', '2026-12-05'), ev('b', '2027-01-10'), ev('c', '2026-12-26')]);
    expect(g.map((m) => [m.ym, m.events.map((e) => e.id)])).toEqual([['2026-12', ['a', 'c']], ['2027-01', ['b']]]);
  });
  it('is empty for no events', () => expect(byMonth([])).toEqual([]));
});

describe('labels', () => {
  it('counts concerts', () => {
    expect([1, 2, 5, 11, 21, 22].map((n) => countLabel(n, 'ru'))).toEqual(['1 концерт', '2 концерта', '5 концертов', '11 концертов', '21 концерт', '22 концерта']);
    expect(countLabel(7, 'kk')).toBe('7 концерт');
  });
  it('prices', () => {
    expect(priceLabel(3000, 'kk')).toBe('3 000 ₸-ден');
    expect(priceLabel(3000, 'ru')).toBe('от 3 000 ₸');
    expect(priceLabel(500, 'ru')).toBe('от 500 ₸');
    expect(priceLabel(0, 'ru')).toBe('Вход свободный');
    expect(priceLabel(0, 'kk')).toBe('Кіру тегін');
  });
});
