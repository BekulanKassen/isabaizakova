import { describe, expect, it } from 'vitest';
import { monthTitle, todayInPavlodar, weekday, dayMonth } from '../../src/lib/dates';

describe('dates', () => {
  it('today in Pavlodar is UTC+5', () => {
    expect(todayInPavlodar(new Date('2026-12-04T20:30:00Z'))).toBe('2026-12-05');
    expect(todayInPavlodar(new Date('2026-12-04T18:30:00Z'))).toBe('2026-12-04');
  });
  it('weekday names', () => {
    expect(weekday('2026-12-05', 'kk')).toBe('сенбі');
    expect(weekday('2026-12-05', 'ru')).toBe('суббота');
    expect(weekday('2026-12-06', 'kk')).toBe('жексенбі');
    expect(weekday('2026-12-07', 'ru')).toBe('понедельник');
  });
  it('month titles', () => {
    expect(monthTitle('2026-12', 'kk')).toBe('Желтоқсан 2026');
    expect(monthTitle('2026-12', 'ru')).toBe('Декабрь 2026');
    expect(monthTitle('2027-01', 'ru')).toBe('Январь 2027');
  });
  it('day and month in a phrase', () => {
    expect(dayMonth('2026-12-05', 'ru')).toBe('5 декабря');
    expect(dayMonth('2026-12-05', 'kk')).toBe('5 желтоқсан');
  });
});
