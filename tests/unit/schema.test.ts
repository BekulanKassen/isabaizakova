import { describe, expect, it } from 'vitest';
import { eventSchema, eventsSchema } from '../../src/lib/schema';

const ok = {
  id: 'jazz-2026-12-26',
  date: '2026-12-26',
  time: '19:00',
  title: { kk: 'Жаңа жылдық джаз', ru: 'Новогодний джаз' },
  ensemble: { kk: 'Джаз оркестрі', ru: 'Джазовый оркестр' },
  genres: ['jazz'],
  priceFrom: 3500,
  image: 'c-jazz.webp',
};

function failsAt(data: unknown, path: string) {
  const r = eventSchema.safeParse(data);
  expect(r.success).toBe(false);
  if (!r.success) expect(r.error.issues.map((i) => i.path.join('.'))).toContain(path);
}

describe('eventSchema', () => {
  it('accepts a correct event and fills the Ticketon link', () => {
    const r = eventSchema.safeParse(ok);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.ticketUrl).toBe('https://ticketon.kz/place/pavlodarskaya-filarmonia');
  });
  it('rejects an empty Russian title', () => failsAt({ ...ok, title: { kk: 'x', ru: '' } }, 'title.ru'));
  it('rejects a date without leading zero', () => failsAt({ ...ok, date: '2026-12-5' }, 'date'));
  it('rejects a price written as text', () => failsAt({ ...ok, priceFrom: '3000' }, 'priceFrom'));
  it('rejects an unknown genre', () => failsAt({ ...ok, genres: ['symph'] }, 'genres.0'));
  it('rejects an event with no genre', () => failsAt({ ...ok, genres: [] }, 'genres'));
  it('rejects a non-existent calendar date', () => failsAt({ ...ok, date: '2026-02-30' }, 'date'));
});

describe('eventsSchema', () => {
  it('accepts an empty afisha', () => expect(eventsSchema.safeParse([]).success).toBe(true));
  it('rejects duplicate ids', () => {
    const r = eventsSchema.safeParse([ok, ok]);
    expect(r.success).toBe(false);
  });
});
