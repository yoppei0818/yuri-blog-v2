# Yuri's Blog

技術記事と読了本をまとめた個人ブログです。日々の開発で学んだことや、読んだ本の記録を発信します。

![Yuri's Blog のトップページ](./public/images/site/top-page.jpg)

## 主な機能

- Markdown で管理する技術記事と読了本
- タグ別の記事・読了本一覧
- 年別アーカイブ
- サイト内検索
- ライトモード / ダークモード
- PC の 2 カラム、モバイルの 1 カラムに対応したレスポンシブ表示
- RSS、サイトマップ、OGP、構造化データなどの SEO 対応

## 技術スタック

- [Nuxt 4](https://nuxt.com/)
- [Nuxt Content](https://content.nuxt.com/)
- [Nuxt UI](https://ui.nuxt.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)

## ディレクトリ構成

```text
app/
  components/       UI コンポーネント
  pages/            各ページ
  assets/css/       共通スタイル
content/
  articles/         技術記事
  books/            読了本
public/
  images/           サイト画像・記事サムネイル
server/
  api/              サイトマップ用 API
  routes/           RSS などのサーバールート
shared/
  constants/        サイト共通設定
```

## コンテンツの追加

技術記事は `content/articles/{年}/{slug}.md`、読了本は `content/books/{年}/{slug}.md` に追加します。公開状態やタイトルなどのメタデータは Markdown の frontmatter で管理します。

### 技術記事

```yaml
---
title: 記事タイトル
description: 記事の説明
publishDate: 2026-08-09
published: true
tags:
  - Nuxt
thumbnail: /images/articles/example.png
---
```

### 読了本

```yaml
---
title: 書籍タイトル
author: 著者名
publishDate: 2026-08-09
published: true
publisher: 出版社名
tags:
  - Web
---
```

`published: false` にすると、一覧や検索などの公開コンテンツから除外できます。
