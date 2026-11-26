// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://isa-philharmonic.kz',
  trailingSlash: 'always',
  i18n: {
    locales: ['kk', 'ru'],
    defaultLocale: 'kk',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
  },
});
