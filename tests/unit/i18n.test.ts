import { describe, expect, it } from 'vitest';
import { altPath, t } from '../../src/i18n/ui';

describe('altPath', () => {
  it('keeps the page when switching language', () => {
    expect(altPath('/ru/afisha/', 'kk')).toBe('/kk/afisha/');
    expect(altPath('/kk/', 'ru')).toBe('/ru/');
    expect(altPath('/kk/news/85-season/', 'ru')).toBe('/ru/news/85-season/');
    expect(altPath('/', 'ru')).toBe('/ru/');
  });
});

describe('t', () => {
  it('returns the string for each language', () => {
    expect(t('ru', 'buyTicket')).toBe('Купить билет');
    expect(t('kk', 'buyTicket')).toBe('Билет алу');
  });
});
