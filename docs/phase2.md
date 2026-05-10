# フェーズ 2: コンテンツ設計

## 概要

Nuxt Content の collection は `articles` / `books` に分ける方針にします。
<br>`content/` はあくまでも記事データの保管庫として使い、トップページやプロフィールなどの通常ページは Nuxt の `app/pages/` 配下で作成します。

## コンテンツ構成

```txt
content/
  articles/
    2026/
      nuxt-content-blog.md
  books/
    2026/
      document-writing.md

app/
  pages/
    index.vue
    about.vue

public/
  images/
    articles/
      nuxt-content-blog.png
    books/
      document-writing.jpg
```

- `articles`: 技術記事
- `books`: 読了本・読書メモ
- `app/pages`: トップページやプロフィールなどの通常ページ
- `public/images/articles`: 技術記事のサムネイル画像
- `public/images/books`: 読了本の表紙画像
- 画像ファイルは `.jpg` / `.png` / `.webp` のみを許可する
- 年別ディレクトリは任意だが、アーカイブ実装を見据えて最初から採用する

## 技術記事の設計

技術記事は「一覧で探しやすい」「詳細ページで読みやすい」ことを優先します。

```yaml
title: Nuxt Contentで技術ブログを作る
description: Nuxt 4とNuxt Contentを使ったブログ構築メモ
publishDate: 2026-05-09
updated: 2026-05-09
published: true
tags:
  - Nuxt
  - Vue
  - TypeScript
thumbnail: /images/articles/nuxt-content-blog.png
```

本文は Markdown で管理します。

```md
---
title: Nuxt Contentで技術ブログを作る
description: Nuxt 4とNuxt Contentを使ったブログ構築メモ
publishDate: 2026-05-09
updated: 2026-05-09
published: true
tags:
  - Nuxt
  - Vue
thumbnail: /images/articles/nuxt-content-blog.png
---

## はじめに

本文...
```

必須項目:

- `title`
- `description`
- `publishDate`
- `published`
- `tags`

任意項目:

- `updated`
- `thumbnail`

補足:

- `publishDate` と `updated` は frontmatter で手動管理する
- `tags` は Phase 3 以降で定数管理と検証の仕組みを検討する
- `thumbnail` は `public/images/articles/` 配下に置き、frontmatter では `/images/articles/...` のパスで指定する
- `thumbnail` の拡張子は `.jpg` / `.png` / `.webp` のいずれかにする

## 読了本の設計

読了本は「本の情報」と「自分の読書メモ」を分けて扱います。
一覧では表紙・タイトル・著者・読了日を見せ、詳細ページを作る場合は本文を読書メモとして表示します。

```yaml
title: エンジニアのためのドキュメントライティング
author: 著者名
publishDate: 2026-05-09
published: true
tags:
  - Writing
  - Documentation
cover: /images/books/document-writing.jpg
publisher: 技術評論社
```

本文例:

```md
---
title: エンジニアのためのドキュメントライティング
author: 著者名
publishDate: 2026-05-09
published: true
tags:
  - Writing
  - Documentation
cover: /images/books/document-writing.jpg
publisher: 技術評論社
---

## 読んだ理由

...

## よかった点

...

## メモ

...
```

必須項目:

- `title`
- `author`
- `publishDate`
- `published`
- `cover`

任意項目:

- `tags`
- `publisher`

## 実装変更

- `content.config.ts` に `articles` / `books` の 2 collection を定義する
- `articles` と `books` には Nuxt Content の schema を設定し、frontmatter の型と必須項目を固定する
- 既存の `content/index.md` と `content/about.md` は通常ページへ移行し、`app/pages/index.vue` と `app/pages/about.vue` で管理する
- 既存の catch-all page は記事詳細や読了本詳細のルーティング方針に合わせて見直す
- Phase 3 以降でトップページから `articles` / `books` を query して一覧表示する
- サンプル記事とサンプル読了本を 1 件ずつ追加して、UI 実装時の実データにする

## テスト方針

- `pnpm build` で Nuxt Content の collection schema が通ることを確認する
- `queryCollection('articles')` と `queryCollection('books')` が型付きで利用できることを確認する
- `published: false` の記事は一覧表示側で除外できる設計にする
- 日付順、タグ表示、サムネイル/表紙画像の有無をサンプルデータで確認する

## 前提

- 技術記事と読了本はどちらも Markdown 本文を持てる設計にする
- `content/` には通常ページを置かず、記事・読了本のみを置く
- 読了本詳細ページは Phase 4 で作るか判断するが、作れるように本文付き Markdown として管理する
- 画像は `public/images/articles/` と `public/images/books/` に置く前提にする
- 画像ファイルの拡張子は `.jpg` / `.png` / `.webp` のみを許可し、SVG はサムネイルや表紙画像として使わない
- 技術記事では `category` / `readingTime` / `featured` を使わず、タグを主な分類軸にする
