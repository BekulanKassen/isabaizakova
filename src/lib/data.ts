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

/** AFISHA_FILE lets the e2e tests build the site with a fixture afisha. */
const afishaFile = process.env.AFISHA_FILE ?? 'src/data/afisha.json';
export const events: Event[] = parse(eventsSchema, JSON.parse(readFileSync(resolve(afishaFile), 'utf-8')), afishaFile);
export const ensembles: Ensemble[] = parse(z.array(ensembleSchema), ensemblesRaw, 'src/data/ensembles.json').sort((a, b) => a.order - b.order);

/** Date the site is built for; BUILD_TODAY pins it in tests. */
export const buildToday: string = process.env.BUILD_TODAY ?? todayInPavlodar();

const newsFile = process.env.NEWS_FILE ?? 'src/data/news.json';
export const news: News[] = parse(z.array(newsSchema), JSON.parse(readFileSync(resolve(newsFile), 'utf-8')), newsFile).sort((a, b) => b.date.localeCompare(a.date));
