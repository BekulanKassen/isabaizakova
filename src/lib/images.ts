import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.webp', { eager: true });
const byName = new Map(Object.entries(files).map(([p, m]) => [p.split('/').pop()!, m.default]));

/** Image from src/assets/img by file name; a missing file stops the build. */
export function img(name: string): ImageMetadata {
  const m = byName.get(name);
  if (!m) throw new Error(`Нет картинки src/assets/img/${name}`);
  return m;
}
