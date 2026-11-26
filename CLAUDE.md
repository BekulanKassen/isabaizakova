# Инструкции для Claude Code

Сайт Павлодарской областной филармонии имени Исы Байзакова. Обзор в `README.md`. Полный контекст проекта, решения заказчика и список задач в `docs/project-notes.md`, прочитайте его первым.

## Главное

- Рабочий сайт на Astro (ветка `astro-site`): компоненты в `src/components/`, данные в `src/data/` (афиша `afisha.json`, коллективы, новости), строки интерфейса в `src/i18n/ui.ts`, стили в `src/styles/global.css`. Запуск: `npm install`, `npm run dev`. Тесты: `npx vitest run` и `npx playwright test`. План: `docs/superpowers/plans/2026-11-26-astro-site.md`.
- `site/index.html` — исходный макет, эталон внешнего вида до запуска.
- Казахский язык основной: `/kk/`, русский `/ru/`. Любой новый текст пишите на обоих языках (`kk` и `ru` в данных или в `ui.ts`).
- Цвета только из CSS-переменных в `:root` (лепнина, сцена, кресла, охра, позолота, фойе). Фиолетовый не использовать.
- Шрифты Prata и Golos Text. Новый шрифт обязан поддерживать Ә Ғ Қ Ң Ө Ұ Ү Һ І.
- Анимации GSAP + ScrollTrigger. Анимировать только `transform`, `opacity`, `clip-path`. Всё движение отключается при `prefers-reduced-motion`. Без GSAP страница должна оставаться целой и читаемой.
- Фирменный приём — арочная рамка фото. Не добавлять других декоративных приёмов: градиентов, свечений, стекла, эмодзи.
- Афиша на декабрь 2026 — пример. Не выдавать её за настоящую и не выдумывать новые факты о филармонии.
- Перед тем как сказать «готово»: тесты, затем `npm run build && node tools/screenshots.mjs` и просмотр снимков на 1440 и 390 px, без горизонтальной прокрутки.

## Скиллы

Ставятся `bash scripts/install-skills.sh`. Для дизайна: `unslop`, `taste-skill`, `emil-design-eng`, `review-animations`, `ui-ux-pro-max`. Для процесса: `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`.
