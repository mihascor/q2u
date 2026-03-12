## PROJECT_OVERVIEW

## 1. Назначение проекта

Это шаблон персонального блога/контент‑сайта на Next.js с поддержкой Markdown/MDX, тегов, проектов, комментариев, рассылки и аналитики. Репозиторий представляет собой форк/копию публичного шаблона `tailwind-nextjs-starter-blog`, который можно адаптировать под свой блог или сайт‑визитку.

## 2. Тип проекта

- **Тип**: веб‑сайт (персональный блог / контент‑платформа)
- **Режим работы**: статический экспорт или хостинг на Vercel / GitHub Pages

## 3. Используемые технологии

- **Языки**: TypeScript, JavaScript, MDX/Markdown, CSS (через Tailwind)
- **Фреймворк**: Next.js (App Router, React Server Components)
- **UI и стили**:
  - Tailwind CSS (утилитарная верстка)
  - Google Fonts (через `next/font`)
- **Контент и MDX**:
  - Contentlayer2 (типизированный доступ к Markdown/MDX‑контенту)
  - remark/rehype плагины (GFM, math, KaTeX, подсветка кода, алерты GitHub)
  - Pliny (обертка для контента, компонентов MDX, поиска, комментариев, рассылки)
- **Менеджер пакетов**: Yarn 3 (`"packageManager": "yarn@3.6.1"`)
- **Сборка/бандлер**:
  - Next.js (turbopack, webpack‑настройки для SVG)
  - esbuild (используется некоторыми тулзами)
- **База данных**: отсутствует; контент хранится в файловой системе в `data/*` и генерируется статически
- **Внешние сервисы (опционально, через конфиг)**:
  - Аналитика: Umami, Plausible, Simple Analytics, Posthog, Google Analytics (настраивается в `data/siteMetadata.js`)
  - Комментарии: Giscus (по умолчанию), Utterances или Disqus
  - Рассылки: Buttondown (по умолчанию), Mailchimp и др. (через Pliny Newsletter API)

## 4. Как запускается проект

- **Установка зависимостей**:
  - `yarn`
  - На Windows перед запуском может потребоваться установить переменную `PWD` (см. `README.md`):
    - PowerShell: `$env:PWD = $(Get-Location).Path`
- **Команды разработки** (`package.json` → `scripts`):
  - `yarn dev` — запуск дев‑сервера Next.js c корректной установкой `INIT_CWD`
  - `yarn start` — альтернативный дев‑запуск `next dev` (без `cross-env`)
- **Команды сборки / продакшен**:
  - `yarn build` — сборка Next.js + генерация RSS после сборки (`scripts/postbuild.mjs`)
  - `yarn serve` — запуск собранного приложения через `next start`
  - `yarn analyze` — сборка с включенным bundle‑analyzer
- **Линтинг и форматирование**:
  - `yarn lint` — `next lint` по папкам `pages`, `app`, `components`, `lib`, `layouts`, `scripts`
  - `lint-staged` + `prettier` — на уровне pre‑commit (через Husky)
- **Entry point**:
  - Веб‑приложение: корневая точка — `app/layout.tsx` (общий layout) и `app/page.tsx` (страница `/`)
  - Контент: входная точка для генерации контента — `contentlayer.config.ts` (читает файлы из `data/*`)

## 5. Основные зависимости

Ключевые зависимости (по смыслу, не полный список):

- **next** — основной фреймворк React‑приложения с App Router.
- **react / react-dom** — библиотека компонентов и рендеринга.
- **tailwindcss, @tailwindcss/forms, @tailwindcss/typography, @tailwindcss/postcss** — ядро и плагины Tailwind для быстрой, адаптивной верстки блога.
- **contentlayer2 / next-contentlayer2** — сборка и типизация MDX/Markdown‑контента из `data/blog` и `data/authors`, генерация `contentlayer/generated`.
- **pliny** — готовые элементы блога: макеты, компоненты MDX, аналитика, комментарии, поиск, Newsletter и др.
- **reading-time** — расчет времени чтения поста, используется в вычисляемых полях Contentlayer.
- **remark-_ / rehype-_ / rehype-prism-plus / rehype-katex / rehype-citation / rehype-katex-notranslate / rehype-preset-minify** — цепочка плагинов для обработки Markdown/MDX: таблицы, формулы, подсветка кода, сноски, минификация HTML.
- **github-slugger** — генерация URL‑дружественных slug‑ов для тегов и ссылок.
- **next-themes** — переключение тем (светлая/темная/системная).
- **body-scroll-lock** — контроль скролла (меню, модалки).
- **@headlessui/react** — headless‑компоненты UI (меню, диалоги, переключатели).
- **@svgr/webpack** — импорт SVG как React‑компонентов в Next.js.
- **Husky, lint-staged, eslint, prettier, @typescript-eslint/\*** **—** настройка линтинга и форматирования, pre‑commit хуки.

## 6. Общая архитектура

- **Фронтенд/UI**:
  - Все страницы и маршруты реализованы в `app/*` (App Router).
  - Общий shell сайта (шапка, футер, контейнер, тема, аналитика, поиск) — в `app/layout.tsx` и компонентах `Header`, `Footer`, `SectionContainer`, `ThemeProviders`.
- **Контентный слой**:
  - Статический контент (посты, авторы, проекты, навигация) хранится в `data/*`.
  - `contentlayer.config.ts` описывает схему документов (Blog, Authors), плагины remark/rehype и хук `onSuccess` для генерации:
    - `app/tag-data.json` (счетчики тегов),
    - поискового индекса `search.json` (в `public`, путь берется из `siteMetadata.search.kbarConfig.searchDocumentsPath`).
- **Роутинг**:
  - `/` — список последних постов: `app/page.tsx` → `app/Main.tsx`.
  - `/blog` — лента постов с пагинацией и тегами: `app/blog/page.tsx`.
  - `/blog/[...slug]` — страница конкретного поста на MDX: `app/blog/[...slug]/page.tsx`.
  - `/projects` — список проектов из `data/projectsData.ts`: `app/projects/page.tsx`.
  - `/about` — страница автора на основе `data/authors/default.mdx`: `app/about/page.tsx`.
  - `/tags` и `/tags/[tag]` — список тегов и посты по тегу: `app/tags/page.tsx`, `app/tags/[tag]/page.tsx`.
  - Технические маршруты SEO: `app/robots.ts`, `app/sitemap.ts`.
- **Серверная логика**:
  - API‑роуты Next.js App Router расположены в `app/api/*`, сейчас используется:
    - `app/api/newsletter/route.ts` — обработчик подписки на рассылку через Pliny Newsletter API.
  - Все операции с контентом (парсинг MDX, генерация тегов, индексов) происходят на стадии билда через Contentlayer.
- **Конфигурация**:
  - Next.js — `next.config.js` (CSP, headers, изображения, bundler, Turbopack).
  - TypeScript — `tsconfig.json` (пути `@/components/*`, `@/data/*` и др., строгие настройки).
  - Метаданные сайта, аналитика, комментарии, поиск — `data/siteMetadata.js`.
  - CI/CD и деплой на GitHub Pages — `.github/workflows/pages.yml`.

## 7. Основные модули

- **UI**:
  - Папка `components/*` — атомарные и составные компоненты (карточки, ссылки, заголовки, навигация, тема, комментарии, таблицы и т.п.).
  - Папка `layouts/*` — шаблоны страниц блога: макеты постов, списков, страницы автора.
  - Папка `css/*` — Tailwind и стили подсветки кода (`tailwind.css`, `prism.css`).
- **API**:
  - `app/api/newsletter/route.ts` — серверный обработчик подписки на рассылку.
- **Бизнес‑логика**:
  - Распределена между:
    - `contentlayer.config.ts` — логика работы с контентом (теги, индекс, схема документов).
    - Компоненты Pliny (например, `pliny/mdx-components`, `pliny/utils/contentlayer`), подключаемые из `app` и `layouts`.
  - Сама доменная логика блога (какие посты, авторы и т.п.) находится в контентных `.mdx` и `data/*.ts|js`.
- **Конфигурация**:
  - `next.config.js`, `tsconfig.json`, `data/siteMetadata.js`, `.github/workflows/pages.yml`, `contentlayer.config.ts`.
- **Утилиты**:
  - Часть утилит импортируется из Pliny (`pliny/utils/*`).
  - Локальные скрипты для пост‑обработки: `scripts/postbuild.mjs`, `scripts/rss.mjs`.
- **Контент**:
  - Папка `data/blog/*.mdx` (и подпапки) — статьи.
  - Папка `data/authors/*.mdx` — авторы.
  - `data/projectsData.ts` — данные проектов для страницы `/projects`.
  - `data/headerNavLinks.ts` — верхнее меню.
  - `data/logo.svg`, `public/static/*` — логотипы и медиа.
- **Хуки / сервисы / state management**:
  - Глобальное состояние темизации — через `ThemeProviders` и `next-themes`.
  - Локальное состояние в отдельных компонентах (например, `components/Comments.tsx` — ленивое подключение комментариев).

## 8. Поток данных

- **1. Запуск приложения**:
  - При `yarn dev` или `yarn build` Next.js запускает Contentlayer через `contentlayer.config.ts`.
  - Contentlayer читает MDX‑файлы из `data/blog` и `data/authors`, обрабатывает их через плагины и генерирует типизированные данные в `contentlayer/generated`.
  - В `onSuccess` Contentlayer:
    - создает `app/tag-data.json` с количеством постов на каждый тег;
    - при включенном `search.provider = 'kbar'` записывает поисковой индекс `search.json` в `public`.
- **2. Обработка запроса пользователя**:
  - Пользователь открывает маршрут (например, `/blog/nested-route/...`).
  - Соответствующая страница в `app/*` (например, `app/blog/[...slug]/page.tsx`) выбирает нужный документ из `allBlogs` (Contentlayer) и подготавливает данные (prev/next, авторы, JSON‑LD).
- **3. Рендер**:
  - Layout страница (например, `PostLayout`) получает контент, метаданные, prev/next.
  - Тело поста рендерится через `MDXLayoutRenderer`, который подставляет React‑компоненты из `components/MDXComponents`.
  - Общая рамка страницы берется из `app/layout.tsx` (шапка, футер, контейнер, тема, аналитика, поиск).
- **4. Взаимодействие пользователя**:
  - Комментарии: компонент `components/Comments.tsx` по клику загружает виджет Giscus (через Pliny).
  - Поиск: Pliny Search (`SearchProvider`) использует сгенерированный индекс.
  - Подписка: форма Newsletter вызывает `app/api/newsletter/route.ts`, который пробрасывает запрос к выбранному провайдеру рассылок.

## 9. Точки входа

- **Next.js App Router**:
  - `app/layout.tsx` — основной layout всего приложения (HTML, `<body>`, тема, аналитика, поиск, header/footer).
  - `app/page.tsx` — корневая страница `/` (список последних постов).
- **Контентный слой**:
  - `contentlayer.config.ts` — конфигурация чтения и обработки контента.
- **Сборка/скрипты**:
  - `scripts/postbuild.mjs` — пост‑обработчик, вызывающий генерацию RSS (`scripts/rss.mjs`) после `next build`.
  - `.github/workflows/pages.yml` — пайплайн GitHub Actions для сборки и деплоя на GitHub Pages.

## 10. Структура проекта

Упрощенное дерево верхнего уровня (только важные директории/файлы):

- `app/`
  - `layout.tsx` — общий layout приложения.
  - `page.tsx` — главная страница (лента последних постов).
  - `Main.tsx` — компонент, собирающий список постов для главной страницы.
  - `about/page.tsx` — страница автора/о сайте.
  - `blog/page.tsx` — список всех постов.
  - `blog/[...slug]/page.tsx` — страница отдельного поста.
  - `projects/page.tsx` — страница проектов.
  - `tags/page.tsx`, `tags/[tag]/page.tsx` — страницы тегов.
  - `api/newsletter/route.ts` — API‑роут рассылки.
  - `seo.tsx`, `robots.ts`, `sitemap.ts`, `not-found.tsx` — SEO и системные страницы.
- `components/`
  - Различные UI‑компоненты блога (карточки проектов, комментарии, навигация, футер, заголовки, переключение темы и др.).
- `layouts/`
  - Макеты для постов, списков и страницы автора (`PostLayout`, `PostSimple`, `PostBanner`, `ListLayoutWithTags`, `AuthorLayout` и т.п.).
- `data/`
  - `blog/*.mdx` — статьи.
  - `authors/*.mdx` — данные авторов.
  - `projectsData.ts` — список проектов.
  - `headerNavLinks.ts` — навигационные ссылки.
  - `siteMetadata.js` — глобальные метаданные, аналитика, комментарии, поиск.
  - `logo.svg`, `references-data.bib` — ресурсы и библиография.
- `css/`
  - `tailwind.css` — подключения и базовые стили Tailwind.
  - `prism.css` — стили подсветки кода.
- `scripts/`
  - `postbuild.mjs` — запуск генерации RSS после сборки.
  - `rss.mjs` — генерация RSS‑ленты блога.
- `public/`
  - `static/images/*`, `static/favicons/*` и др. ассеты (описаны в README).
- `contentlayer.config.ts` — конфигурация Contentlayer.
- `next.config.js` — конфигурация Next.js (CSP, Turbopack, изображения, заголовки, загрузка SVG).
- `tsconfig.json` — конфигурация TypeScript с алиасами (`@/components/*`, `@/data/*` и др.).
- `package.json` — зависимости, скрипты и метаданные проекта.
- `.github/workflows/pages.yml` — GitHub Actions workflow для деплоя.

## 11. Ключевые файлы проекта

- **`app/layout.tsx`** — единый каркас страницы: подключает стили, аналитики, поиск, тему, хедер, футер и оборачивает все маршруты.
- **`app/page.tsx` + `app/Main.tsx`** — главный список постов, формирующий первый экран сайта.
- **`app/blog/page.tsx`** — основная страница блога со списком и пагинацией.
- **`app/blog/[...slug]/page.tsx`** — отвечает за рендер конкретного поста: выбирает данные из Contentlayer, формирует метаданные, подключает нужный layout.
- **`layouts/PostLayout.tsx`, `PostSimple.tsx`, `PostBanner.tsx`** — варианты шаблонов отображения статей.
- **`layouts/ListLayoutWithTags.tsx`** — макет списка постов с отображением тегов.
- **`data/blog/*.mdx`** — сами статьи и их фронтматтер (заголовки, даты, теги и др.).
- **`data/authors/*.mdx`** — данные автора (биография, контакты, ссылки), используемые на странице `/about` и в карточках автора.
- **`data/siteMetadata.js`** — глобальная конфигурация сайта (URL, соцсети, аналитика, комментарии, поиск).
- **`contentlayer.config.ts`** — описание схем документов (Blog, Authors), плагинов и пост‑обработки (теги, поиск).
- **`app/api/newsletter/route.ts`** — точка интеграции с сервисом рассылок.
- **`next.config.js`** — глобальная конфигурация Next.js (CSP, заголовки, изображения, Turbopack/webpack).
- **`.github/workflows/pages.yml`** — автоматический билд и деплой на GitHub Pages.

## 12. Где что менять

- **UI**:
  - Меню, шапка, футер, контейнеры, карточки: папка `components/*`.
  - Компоновка страниц (сайдбары, структура контента): папка `layouts/*` и файлы в `app/*`.
  - Глобальные стили и тема Tailwind: `css/tailwind.css`, `css/prism.css`, `tailwind.config.(js|ts)` (если присутствует).
- **API**:
  - Эндпоинты для внешних интеграций (рассылка и др.): папка `app/api/*`.
- **Бизнес‑логика блога**:
  - Схема контента, вычисляемые поля, генерация тегов и поиска: `contentlayer.config.ts`.
  - Логика отбора/сортировки/пагинации постов: `app/page.tsx`, `app/blog/page.tsx`, `app/blog/[...slug]/page.tsx`, `app/tags/[tag]/page.tsx`.
- **Конфигурация**:
  - Базовые метаданные (название сайта, автор, соцсети, аналитика, комментарии, поиск): `data/siteMetadata.js`.
  - Поведение Next.js (CSP, изображения, Turbopack, заголовки): `next.config.js`.
  - TypeScript и алиасы импортов: `tsconfig.json`.
  - Скрипты сборки, деплой, pre‑commit хуки: `package.json`, `.github/workflows/pages.yml`, конфиг Husky/lint‑staged.
- **Контент**:
  - Посты: `data/blog/*.mdx` (создание/редактирование статей).
  - Авторы: `data/authors/*.mdx`.
  - Проекты: `data/projectsData.ts`.
  - Навигация: `data/headerNavLinks.ts`.
  - Логотип и изображения: `data/logo.svg`, `public/static/*`.
- **Маршруты**:
  - Статические и динамические маршруты: структура папки `app/*` (создание новых страниц — через создание файлов/папок в `app`).

## 13. Краткое резюме

1. Проект — шаблон блога на Next.js с App Router, Tailwind и Contentlayer.
2. Контент хранится в `data/blog` и `data/authors` в формате MDX и типизируется через Contentlayer.
3. Основной layout и каркас сайта находятся в `app/layout.tsx`, а главная страница — в `app/page.tsx` и `app/Main.tsx`.
4. Блоговая логика (списки, пагинация, теги) реализована в страницах `app/blog/*` и `app/tags/*`.
5. Проекты, навигация и метаданные вынесены в `data/projectsData.ts`, `data/headerNavLinks.ts` и `data/siteMetadata.js`.
6. Визуальный облик управляется компонентами из `components/*`, layout‑ами из `layouts/*` и Tailwind‑стилями из `css/*`.
7. API‑функциональность ограничивается маршрутом `app/api/newsletter/route.ts`, использующим Pliny Newsletter API.
8. Сборка и деплой на GitHub Pages автоматизированы workflow‑ом `.github/workflows/pages.yml`.
9. Для разработки достаточно выполнить `yarn`, затем `yarn dev` и открыть `http://localhost:3000`.
10. Добавление/изменение статей сводится к редактированию/созданию MDX‑файлов в `data/blog`.

## Замечания

- В репозитории присутствует папка `.next/*` (артефакты сборки и дев‑сервера Next.js), которая обычно не должна коммититься и должна быть добавлена в `.gitignore`.
- Папка `.husky_` из вывода `git status` выглядит как временный или альтернативный путь для Husky‑хуков; имеет смысл проверить, нужна ли она, и при необходимости удалить или вернуть стандартную структуру `.husky/`.
