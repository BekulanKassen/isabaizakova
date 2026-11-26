# Рабочий сайт на Astro: план

> **Для исполнителя (агента):** обязательный скилл: superpowers:subagent-driven-development (рекомендуется) или superpowers:executing-plans. Шаги отмечаются чекбоксами (`- [ ]`).

## Коротко, для заказчика

Сейчас сайт — это одна страница-макет (`site/index.html`). План превращает её в настоящий сайт:

1. **Афиша в одном файле.** Сотрудник филармонии правит строчку в `src/data/afisha.json` прямо на GitHub в браузере, и сайт пересобирается сам. Прошедшие концерты исчезают сами, карточка «Ближайший концерт» берётся из афиши.
2. **Два языка с отдельными адресами:** `/kk/` (открывается первым) и `/ru/`. Так сайт лучше находят в поиске.
3. **Страницы старого сайта** («О филармонии», «Руководство», «Комплаенс», «Вакансии» и другие) переезжают на новый сайт. Госучреждению терять их нельзя.
4. **Внешне всё как в макете:** те же цвета, шрифты, арки и анимации.

Без ответа филармонии можно сделать задачи 1–8. Задачам 9 и 10 нужны тексты и данные от филармонии, задаче 11 — решение, где размещать сайт.

---

**Цель:** статический двуязычный сайт на Astro с афишей из файла данных, внешне равный макету `site/index.html`.

**Архитектура:** Astro собирает статические HTML-страницы в `dist/`. Данные (афиша, коллективы, новости, страницы) лежат в content collections (`src/data/*.json`, `src/content/**.md`) и проверяются схемой zod при сборке: ошибка в афише валит сборку, а не сайт. Логика афиши — чистые функции в `src/lib/`, покрытые юнит-тестами. Анимации GSAP из npm, загружаются одним модулем; без JS страница цела.

**Стек:** Astro (последняя стабильная на момент старта, версия закрепляется в `package.json`), TypeScript, Vitest, @playwright/test, gsap. Node 22.

**Спецификация:** `docs/project-notes.md`, разделы «Решения, принятые с заказчиком», «Дизайн», «Следующий этап: рабочий сайт», «Что нужно сделать до запуска». Эталон внешнего вида и поведения: `site/index.html`. Правила: `CLAUDE.md`.

## Общие ограничения

- Новый сайт **полностью заменяет** isa-philharmonic.kz.
- **Казахский основной:** `/` перенаправляет на `/kk/`. Русский на `/ru/`. У `<html>` атрибут `lang="kk"` или `lang="ru"`, у каждой страницы `<link rel="alternate" hreflang>` на обе версии.
- Каждый видимый текст есть на двух языках. Строки интерфейса хранятся только в `src/i18n/ui.ts`, тексты контента — в данных.
- Билеты **только ссылкой на Freedom Ticketon** (`ticketUrl` у события, по умолчанию `https://ticketon.kz/place/pavlodarskaya-filarmonia`), открываются в новой вкладке, без встроенного виджета.
- Цвета только из переменных `:root` макета (`--stucco`, `--paper`, `--ink`, `--ink-2`, `--ink-3`, `--stage`, `--seat`, `--ochre`, `--gold`, `--mint` и их пары). Фиолетового нет.
- Шрифты Prata и Golos Text (400, 500), подмножество cyrillic-ext.
- Единственный декоративный приём — арочная рамка фото. Без градиентов (кроме затемнения на фото), свечений, стекла и эмодзи.
- Анимируются только `transform`, `opacity`, `clip-path`, кривая `cubic-bezier(.23,1,.32,1)`. При `prefers-reduced-motion: reduce` GSAP не запускается. Без JS всё содержимое видно.
- Никаких выдуманных фактов о филармонии. Событие с `sample: true` выводится с пометкой «мысал / пример». Сайт не публикуется, пока в афише есть `sample: true` (это проверяет тест в задаче 11).
- Нет горизонтальной прокрутки на 320, 390 и 1440 px.
- Фото — WebP из `site/img/` (переносятся в `src/assets/img/`, обрабатываются `astro:assets`).

## На что смотреть при проверке

1. **Афиша устаревает между сборками.** Сайт собран вчера, концерт был вчера вечером, а сегодня он всё ещё в списке. Ожидание: в браузере прошедшие события скрываются скриптом по текущей дате Павлодара (UTC+5), а сайт пересобирается раз в сутки. Тест: задача 4, `hidePast`.
2. **Пустой месяц или пустой фильтр.** Ожидание: текст «Бұл айда концерт жоқ / В этом месяце концертов нет» и ссылка на Ticketon, а не пустое место. Тест: задачи 3 и 4.
3. **Ошибка сотрудника в `afisha.json`:** нет русского названия, дата `2026-12-5`, цена строкой, жанр с опечаткой. Ожидание: сборка падает с понятной ошибкой, на сайт ничего не уходит. Тест: задача 2.
4. **Длинные казахские названия** (как у оркестра Омарова) на 320 px. Ожидание: перенос строки без прокрутки вбок. Тест: задача 8.
5. **Переключение языка на внутренней странице.** Человек на `/ru/afisha/` жмёт ҚАЗ. Ожидание: попадает на `/kk/afisha/`, а не на главную. Если такой страницы нет, то на `/kk/`. Тест: задача 1, `altPath`.

---

## Файлы

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts, playwright.config.ts
src/
  content.config.ts          схемы: afisha, ensembles, news, pages
  data/afisha.json           события (правит сотрудник)
  data/ensembles.json        8 коллективов
  content/news/{kk,ru}/*.md  новости
  content/pages/{kk,ru}/*.md страницы старого сайта
  i18n/ui.ts                 строки интерфейса и t(), altPath()
  lib/afisha.ts              чистые функции афиши
  lib/dates.ts               дни недели, месяцы, «сегодня» в Павлодаре
  styles/global.css          токены :root и базовые стили из макета
  scripts/motion.ts          GSAP и ScrollTrigger (перенос из макета)
  scripts/afisha-filter.ts   фильтр жанров и скрытие прошедших событий
  scripts/ui.ts              шапка, меню (с удержанием фокуса), нижняя панель
  components/                Header, Menu, Hero, NextConcert, Afisha, EventRow,
                             Ensembles, Hall, History85, News, Visit, Footer, ActionBar
  layouts/Base.astro         <html lang>, head, hreflang, og, шрифты
  pages/index.astro          редирект на /kk/
  pages/[lang]/index.astro   главная
  pages/[lang]/afisha.astro  полная афиша по месяцам
  pages/[lang]/news/[...slug].astro
  pages/[lang]/[page].astro  страницы старого сайта
tests/unit/*.test.ts
tests/e2e/*.spec.ts
docs/afisha-howto.md         инструкция для сотрудника
```

`site/` остаётся эталоном до запуска, удаляется в задаче 11.

---

### Task 1: Каркас Astro, два языка, базовый макет

**Файлы:** создать `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/i18n/ui.ts`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/[lang]/index.astro` (пока только `<h1>`), `tests/unit/i18n.test.ts`. Изменить `.gitignore` (добавить `dist/`, `.astro/`).

**Интерфейсы (результат):**
- `type Lang = 'kk' | 'ru'`; `const LANGS: Lang[] = ['kk','ru']`
- `t(lang: Lang, key: UiKey): string`, где `UiKey` — ключ словаря `ui.kk` (у `ui.ru` те же ключи, проверяет TypeScript)
- `altPath(pathname: string, to: Lang): string`
- `Base.astro` принимает `{ lang: Lang; title: string; description: string; path: string }`

- [ ] **Шаг 1.** `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`, затем `npm i -D vitest @playwright/test` и `npm i gsap`. В `astro.config.mjs`: `site: 'https://isa-philharmonic.kz'`, `i18n: { locales: ['kk','ru'], defaultLocale: 'kk', routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true } }`, `trailingSlash: 'always'`.
- [ ] **Шаг 2. Тест (должен упасть):** `tests/unit/i18n.test.ts`
  ```ts
  expect(altPath('/ru/afisha/', 'kk')).toBe('/kk/afisha/');
  expect(altPath('/kk/', 'ru')).toBe('/ru/');
  expect(altPath('/kk/news/85-season/', 'ru')).toBe('/ru/news/85-season/');
  expect(altPath('/', 'ru')).toBe('/ru/');
  expect(t('ru', 'buyTicket')).toBe('Купить билет');
  expect(t('kk', 'buyTicket')).toBe('Билет алу');
  ```
  `npx vitest run tests/unit/i18n.test.ts`: FAIL, модуля нет.
- [ ] **Шаг 3.** Реализовать `src/i18n/ui.ts`. Перенести в словарь все строки интерфейса из `site/index.html` (казахский — текст элемента, русский — `data-ru`): навигация, кнопки, подписи фактов, «Жақын концерт / Ближайший концерт», названия жанров `sym folk jazz choir dance kids`, пустая афиша, «мысал / пример».
- [ ] **Шаг 4.** `npx vitest run`: PASS.
- [ ] **Шаг 5.** `Base.astro`: перенести `<head>` макета (meta, og, theme-color, иконка, шрифты), `<html lang={lang}>`, `hreflang` на обе версии и `x-default` на `/kk/`. В `global.css` перенести `:root`, сброс и общие классы (`.wrap`, `.btn*`, `.eyebrow`, `.tnum`, `.sr`, `.skip`, фокус). `src/pages/index.astro` перенаправляет на `/kk/`.
- [ ] **Шаг 6.** `npm run build`: в `dist/kk/index.html` есть `lang="kk"`, в `dist/ru/index.html` есть `lang="ru"`.
- [ ] **Шаг 7.** Коммит `feat: каркас Astro, два языка`.

### Task 2: Схемы данных и перенос афиши

**Файлы:** создать `src/content.config.ts`, `src/data/afisha.json`, `src/data/ensembles.json`, `tests/unit/schema.test.ts`. Перенести `site/img/*.webp` в `src/assets/img/`.

**Интерфейсы (результат):** экспорт `eventSchema` и коллекции `afisha`, `ensembles`.
```ts
Event = {
  id: string;                       // латиница-дефис, уникален
  date: string;                     // /^\d{4}-\d{2}-\d{2}$/
  time: string;                     // /^\d{2}:\d{2}$/
  title: { kk: string; ru: string };      // оба непустые
  ensemble: { kk: string; ru: string };
  genres: ('sym'|'folk'|'jazz'|'choir'|'dance'|'kids')[];  // хотя бы один
  priceFrom: number;                // целое ₸, ≥ 0
  ticketUrl: string;                // url, по умолчанию страница филармонии на Ticketon
  image: string;                    // имя файла из src/assets/img/
  sample?: boolean;                 // true = выдуманное событие из макета
}
Ensemble = { id; name:{kk,ru}; lead:{kk,ru}; image; size: 'wide'|'half'; order: number }
```

- [ ] **Шаг 1. Тест (должен упасть):** `schema.test.ts` проверяет `eventSchema.safeParse` на:
  - корректном событии: `success: true`;
  - пустом `title.ru`, дате `'2026-12-5'`, `priceFrom: '3000'`, жанре `'symph'`, пустом `genres`: `success: false`, в каждом случае путь ошибки указывает на это поле.
- [ ] **Шаг 2.** `npx vitest run tests/unit/schema.test.ts`: FAIL.
- [ ] **Шаг 3.** `content.config.ts` с коллекциями через `file()`-загрузчик. Проверка, что файл из `image` существует, и уникальность `id` — в `superRefine` коллекции.
- [ ] **Шаг 4.** Перенести 7 событий декабря из макета в `afisha.json`, у всех `sample: true`. Перенести 8 коллективов в `ensembles.json`.
- [ ] **Шаг 5.** `npx vitest run` и `npm run build`: PASS. Испортить одну дату в `afisha.json`, `npm run build` падает с указанием поля, вернуть.
- [ ] **Шаг 6.** Коммит `feat: схемы и данные афиши и коллективов`.

### Task 3: Логика афиши

**Файлы:** создать `src/lib/dates.ts`, `src/lib/afisha.ts`, `tests/unit/afisha.test.ts`, `tests/unit/dates.test.ts`.

**Интерфейсы (результат):**
- `todayInPavlodar(now?: Date): string` возвращает `YYYY-MM-DD` по `Asia/Almaty` (UTC+5, как в Павлодаре)
- `weekday(date: string, lang: Lang): string` (kk: `дүйсенбі … жексенбі`, ru: `понедельник … воскресенье`, строчными, как в макете)
- `monthTitle(ym: string, lang: Lang): string`: `'2026-12'` → `Желтоқсан 2026` / `Декабрь 2026`
- `upcoming(events: Event[], today: string): Event[]`: события с `date >= today`, по возрастанию `date+time`
- `nextConcert(events: Event[], today: string): Event | undefined`
- `byMonth(events: Event[]): { ym: string; events: Event[] }[]`
- `countLabel(n: number, lang: Lang): string`: ru `1 концерт / 2 концерта / 5 концертов / 11 концертов / 21 концерт`, kk `n концерт`
- `priceLabel(n: number, lang: Lang): string`: `3 000 ₸-ден` / `от 3 000 ₸` (неразрывный пробел в тысячах)

- [ ] **Шаг 1. Тесты (должны упасть):** по одному тесту на каждую функцию с точными значениями выше, плюс:
  - `upcoming` не теряет событие сегодня в 23:00 и отбрасывает вчерашнее;
  - `nextConcert([], …)` возвращает `undefined`;
  - `todayInPavlodar(new Date('2026-12-04T20:30:00Z'))` возвращает `'2026-12-05'`;
  - `weekday('2026-12-05','kk')` возвращает `'сенбі'`.
- [ ] **Шаг 2.** `npx vitest run`: FAIL.
- [ ] **Шаг 3.** Реализовать (даты через `Intl.DateTimeFormat` с `timeZone: 'Asia/Almaty'`, названия дней и месяцев — свои массивы, `Intl` для `kk` ненадёжен).
- [ ] **Шаг 4.** `npx vitest run`: PASS.
- [ ] **Шаг 5.** Коммит `feat: логика афиши`.

### Task 4: Главная: шапка, главный экран, афиша

**Файлы:** создать `Header.astro`, `Menu.astro`, `ActionBar.astro`, `Hero.astro`, `NextConcert.astro`, `Afisha.astro`, `EventRow.astro`, `src/scripts/ui.ts`, `src/scripts/afisha-filter.ts`, `playwright.config.ts`, `tests/e2e/home.spec.ts`. Изменить `src/pages/[lang]/index.astro`.

**Интерфейсы:**
- Потребляет: `t`, `altPath`, коллекцию `afisha`, функции задачи 3.
- Результат: разметка строки события как в макете (`li.ev` с `data-g="<жанры через пробел>"` и `data-date="YYYY-MM-DD"`). `afisha-filter.ts` экспортирует `hidePast(root: HTMLElement, today: string): void` и `initFilter(root: HTMLElement): void`.

- [ ] **Шаг 1. e2e-тесты (должны упасть),** `playwright.config.ts` запускает `npm run preview`:
  - `/kk/`: `h1` содержит «Иса Байзақов», кнопка ҚАЗ нажата, ссылка РУС ведёт на `/ru/`;
  - `/ru/`: `html[lang=ru]`, `h1` содержит «Исы Байзакова»;
  - фильтр «Джаз» оставляет видимыми только `li.ev` с `jazz` в `data-g`, счётчик совпадает с их числом;
  - фильтр без событий показывает текст пустой афиши;
  - событие с `sample: true` показывает пометку «мысал» / «пример»;
  - при `page.clock.setFixedTime('2026-12-14T10:00:00+05:00')` события 5, 6, 12 и 13 декабря скрыты, событие 19-го видно;
  - с `javaScriptEnabled: false` все события и все секции видны.
- [ ] **Шаг 2.** `npx playwright test tests/e2e/home.spec.ts`: FAIL.
- [ ] **Шаг 3.** Перенести разметку и стили шапки, меню, главного экрана и афиши из макета в компоненты, стили — в `<style>` компонентов. Тексты из `t()` и данных. Переключатель языка — две ссылки `altPath(Astro.url.pathname, …)` с `aria-current` на текущем языке, `localStorage` больше не нужен. `NextConcert` берёт `nextConcert(...)` на дату сборки, а если событий нет, то не выводится. `ui.ts` переносит шапку, меню (с удержанием фокуса из коммита «Правки по проверкам taste-skill») и нижнюю панель.
- [ ] **Шаг 4.** `npx playwright test`: PASS.
- [ ] **Шаг 5.** Коммит `feat: главная — шапка, главный экран, афиша`.

### Task 5: Главная: коллективы, зал, 85 лет, новости, посетителям, подвал

**Файлы:** создать `Ensembles.astro`, `Hall.astro`, `History85.astro`, `News.astro`, `Visit.astro`, `Footer.astro`, `src/content/news/{kk,ru}/*.md` (3 новости из макета), коллекцию `news` в `content.config.ts` (`{ title, date, image, lang }`), `tests/e2e/sections.spec.ts`.

- [ ] **Шаг 1. e2e-тесты (должны упасть):** на `/kk/` и `/ru/` есть секции `#ujymdar` (8 карточек), `#zal` (4 главы), `#tarih` (6 вех), `#news` (3 новости со ссылками на `/<lang>/news/<slug>/`), `#kelushilerge`, подвал. Телефоны и адрес совпадают с макетом.
- [ ] **Шаг 2.** `npx playwright test tests/e2e/sections.spec.ts`: FAIL.
- [ ] **Шаг 3.** Перенести секции из макета. Коллективы из `ensembles.json`, новости из коллекции. Тексты зала и истории — в `ui.ts` (или по файлу на язык, если больше 20 строк). Ссылки-заглушки `#news`, `#top` заменить на настоящие адреса страниц. Ссылки на страницы, которых ещё нет (задача 9), не выводить.
- [ ] **Шаг 4.** `npx playwright test`: PASS.
- [ ] **Шаг 5.** Коммит `feat: остальные секции главной`.

### Task 6: Анимации GSAP из npm

**Файлы:** создать `src/scripts/motion.ts`, `tests/e2e/motion.spec.ts`. Подключить в `Base.astro` модулем.

- [ ] **Шаг 1. e2e-тесты (должны упасть):**
  - с `reducedMotion: 'reduce'` у `#arch` нет `clip-path` из анимации, а история — сеткой, без класса `tl-h`;
  - на 1440 px после прокрутки к `.hall-intro` у `#arch` вычисленный `clip-path` меняется;
  - в консоли нет ошибок.
- [ ] **Шаг 2.** FAIL.
- [ ] **Шаг 3.** Перенести блок GSAP из конца `site/index.html` без изменений поведения, импорт `gsap` и `gsap/ScrollTrigger` из npm. Выход в начале при `prefers-reduced-motion`.
- [ ] **Шаг 4.** PASS.
- [ ] **Шаг 5.** Коммит `feat: анимации GSAP из npm`.

### Task 7: Страница полной афиши и новости

**Файлы:** создать `src/pages/[lang]/afisha.astro`, `src/pages/[lang]/news/[...slug].astro`, `tests/e2e/afisha-page.spec.ts`.

- [ ] **Шаг 1. e2e-тесты (должны упасть):** на `/kk/afisha/` все предстоящие события сгруппированы по месяцам с заголовками `monthTitle`, у каждого кнопка на `ticketUrl` с `target=_blank`. На главной в афише не больше 7 ближайших событий и ссылка «Барлық афиша / Вся афиша» на `/kk/afisha/`. Страница новости открывается на обоих языках, переключатель ведёт на ту же новость.
- [ ] **Шаг 2.** FAIL.
- [ ] **Шаг 3.** Реализовать, переиспользуя `EventRow` и `byMonth`.
- [ ] **Шаг 4.** PASS.
- [ ] **Шаг 5.** Коммит `feat: страница афиши и страницы новостей`.

### Task 8: Проверка вёрстки на 320, 390 и 1440 px

**Файлы:** создать `tests/e2e/layout.spec.ts`. Изменить `tools/screenshots.mjs`: снимать `dist/kk/` через `astro preview`, а не `site/`.

- [ ] **Шаг 1. Тест:** на каждой странице (`/kk/`, `/ru/`, `/kk/afisha/`, одна новость) при ширине 320, 390 и 1440 `document.documentElement.scrollWidth <= innerWidth`. Отдельный тест подставляет событие с названием из 80 казахских символов и проверяет то же на 320.
- [ ] **Шаг 2.** `npx playwright test tests/e2e/layout.spec.ts`. Исправить, что упало.
- [ ] **Шаг 3.** `node tools/screenshots.mjs`, сравнить снимки с `docs/screenshots/` и с макетом. Расхождения исправить.
- [ ] **Шаг 4.** Коммит `test: вёрстка без прокрутки вбок, скриншоты с Astro`.

### Task 9: Страницы старого сайта *(нужны тексты)*

**Файлы:** создать коллекцию `pages` (`{ title, order, lang, slug }`), `src/pages/[lang]/[page].astro`, `src/content/pages/{kk,ru}/*.md`, `tests/e2e/pages.spec.ts`.

Страницы: `about` (О филармонии), `management` (Руководство), `people` (Лица), `compliance` (Комплаенс), `anticorruption` (Противодействие коррупции), `gossfera` (Госсфера), `vacancies` (Вакансии), `gallery` (Галерея).

- [ ] **Шаг 1.** Получить тексты: со старого сайта (нужен доступ сессии к хосту `isa-philharmonic.kz`) или файлами от филармонии. Текст не выдумывать. Страницы без полученного текста не создавать.
- [ ] **Шаг 2. Тест (должен упасть):** для каждого файла в `src/content/pages/kk/` есть пара в `ru/` с тем же `slug`, страница открывается на обоих языках, ссылка есть в подвале.
- [ ] **Шаг 3.** Реализовать шаблон страницы (заголовок, текст, документы ссылками на PDF в `public/docs/`).
- [ ] **Шаг 4.** PASS.
- [ ] **Шаг 5.** Коммит `feat: страницы старого сайта`.

### Task 10: Настоящая афиша и инструкция для сотрудника *(нужны данные)*

**Файлы:** изменить `src/data/afisha.json`. Создать `docs/afisha-howto.md`.

- [ ] **Шаг 1.** Заменить события с `sample: true` настоящими от филармонии: дата, время, название на двух языках, коллектив, цена, ссылка Ticketon.
- [ ] **Шаг 2.** Написать `docs/afisha-howto.md` простым языком: как открыть файл на GitHub, скопировать блок события, что значит каждое поле, как узнать, что сайт обновился, что делать, если сборка упала.
- [ ] **Шаг 3.** `npm run build` и `npx playwright test`: PASS.
- [ ] **Шаг 4.** Коммит `content: настоящая афиша`.

### Task 11: Публикация *(нужно решение по хостингу)*

**Файлы:** создать `.github/workflows/build.yml`, `tests/unit/launch.test.ts`. Удалить `site/`. Обновить `README.md`, `CLAUDE.md`, `docs/project-notes.md`.

- [ ] **Шаг 1. Тест:** `launch.test.ts` падает, если в `afisha.json` есть `sample: true`.
- [ ] **Шаг 2.** Workflow: на каждый push и по расписанию раз в сутки (`cron: '7 19 * * *'` UTC = 00:07 в Павлодаре) запускаются `npm ci`, `npx vitest run`, `npm run build`, `npx playwright test`, затем выкладка на выбранный хостинг. Варианты: Vercel или хостинг филармонии (по FTP или SSH) — решает заказчик.
- [ ] **Шаг 3.** Проверить на опубликованном адресе: `/` ведёт на `/kk/`, обе версии открываются, кнопки билетов ведут на Ticketon.
- [ ] **Шаг 4.** Удалить `site/`, обновить документацию.
- [ ] **Шаг 5.** Коммит `chore: публикация и удаление макета`.
