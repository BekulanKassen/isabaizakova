import type { Lang } from '../i18n/ui';

const WEEKDAYS: Record<Lang, string[]> = {
  kk: ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'],
  ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
};
const MONTHS: Record<Lang, string[]> = {
  kk: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};
const MONTHS_GEN_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

/** YYYY-MM-DD in Pavlodar (UTC+5, no daylight saving). */
export function todayInPavlodar(now: Date = new Date()): string {
  return new Date(now.getTime() + 5 * 3600_000).toISOString().slice(0, 10);
}

const parts = (date: string) => date.split('-').map(Number) as [number, number, number];

export function weekday(date: string, lang: Lang): string {
  const [y, m, d] = parts(date);
  return WEEKDAYS[lang][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export function monthTitle(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[lang][m - 1]} ${y}`;
}

export function dayMonth(date: string, lang: Lang): string {
  const [, m, d] = parts(date);
  return lang === 'ru' ? `${d} ${MONTHS_GEN_RU[m - 1]}` : `${d} ${MONTHS.kk[m - 1].toLowerCase()}`;
}
