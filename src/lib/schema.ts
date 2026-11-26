import { z } from 'astro/zod';
import { TICKETON } from '../i18n/ui';

export const GENRES = ['sym', 'folk', 'jazz', 'choir', 'dance', 'kids'] as const;
export type Genre = (typeof GENRES)[number];

const text = z.string().trim().min(1);
const both = z.object({ kk: text, ru: text });
const imageName = z.string().regex(/^[a-z0-9-]+\.webp$/, 'имя файла из src/assets/img, например c-jazz.webp');

const isRealDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, day));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === day;
};

export const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'латиница, цифры и дефис'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'дата в виде 2026-12-05').refine(isRealDate, 'такой даты нет'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'время в виде 18:00'),
  title: both,
  ensemble: both,
  genres: z.array(z.enum(GENRES)).min(1, 'хотя бы один жанр'),
  priceFrom: z.number().int().nonnegative(),
  ticketUrl: z.string().url().default(TICKETON),
  image: imageName,
  sample: z.boolean().optional(),
});
export type Event = z.infer<typeof eventSchema>;

export const eventsSchema = z.array(eventSchema).superRefine((list, ctx) => {
  const seen = new Set<string>();
  list.forEach((e, i) => {
    if (seen.has(e.id)) ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `id «${e.id}» повторяется` });
    seen.add(e.id);
  });
});

export const ensembleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: both,
  lead: both,
  image: imageName,
  alt: both,
  size: z.enum(['wide', 'narrow', 'half']),
  order: z.number().int(),
});
export type Ensemble = z.infer<typeof ensembleSchema>;
