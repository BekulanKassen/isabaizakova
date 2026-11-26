import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'astro/zod';
import ensemblesRaw from '../data/ensembles.json';
import { todayInPavlodar } from './dates';
import { ensembleSchema, eventsSchema, newsSchema, type Ensemble, type Event, type News } from './schema';

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const lines = r.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Ошибка в ${file}:\n${lines}`);
  }
  return r.data;
}

/** Read a JSON file; a syntax error names the file and the line. */
export function readJson(file: string): unknown {
  const text = readFileSync(resolve(file), 'utf-8');
  try {
    return JSON.parse(text);
  } catch (e) {
    const msg = (e as Error).message;
    const pos = Number(/position (\d+)/.exec(msg)?.[1] ?? NaN);
    let where = '';
    if (Number.isFinite(pos)) {
      const before = text.slice(0, pos).split('\n');
      where = `, строка ${before.length}, символ ${before[before.length - 1].length + 1}`;
    } else {
      // This Node does not report a position: find the usual mistakes ourselves.
      const hit = /,\s*[\]}]|[«»“”]/.exec(text);
      if (hit) {
        const before = text.slice(0, hit.index + hit[0].length).split('\n');
        where = `, строка ${before.length}`;
      }
    }
    throw new Error(`Ошибка в ${file}${where}: файл не читается как JSON. Проверьте запятые между блоками, лишнюю запятую в конце и прямые кавычки "…" вместо «ёлочек». (${msg})`);
  }
}

/** AFISHA_FILE lets the e2e tests build the site with a fixture afisha. */
const afishaFile = process.env.AFISHA_FILE ?? 'src/data/afisha.json';
export const events: Event[] = parse(eventsSchema, readJson(afishaFile), afishaFile);
export const ensembles: Ensemble[] = parse(z.array(ensembleSchema), ensemblesRaw, 'src/data/ensembles.json').sort((a, b) => a.order - b.order);

/** Date the site is built for; BUILD_TODAY pins it in tests. */
export const buildToday: string = process.env.BUILD_TODAY ?? todayInPavlodar();

const newsFile = process.env.NEWS_FILE ?? 'src/data/news.json';
export const news: News[] = parse(z.array(newsSchema), readJson(newsFile), newsFile).sort((a, b) => b.date.localeCompare(a.date));
