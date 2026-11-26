import afishaRaw from '../data/afisha.json';
import ensemblesRaw from '../data/ensembles.json';
import { ensembleSchema, eventsSchema, type Ensemble, type Event } from './schema';
import { z } from 'astro/zod';

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const lines = r.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Ошибка в ${file}:\n${lines}`);
  }
  return r.data;
}

export const events: Event[] = parse(eventsSchema, afishaRaw, 'src/data/afisha.json');
export const ensembles: Ensemble[] = parse(z.array(ensembleSchema), ensemblesRaw, 'src/data/ensembles.json').sort((a, b) => a.order - b.order);
