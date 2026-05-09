# Roadmap

YURI-TECH を Nuxt 4 + Nuxt Content + Nuxt UI で作っていくための実装ロードマップです。

## Goal

添付デザインのような、技術記事・読了本・プロフィール・アーカイブを見やすくまとめた個人技術ブログを作る。

最初は静的ブログとして作り、記事や読了本は Markdown と frontmatter で管理する。

## Phase 1: Design Foundation

- Nuxt UI を UI の土台として使う。
- サイト全体のカラー、角丸、余白、カード表現、コンテナ幅を定義する。
- ライトモードとダークモードの両方で破綻しない色設計にする。
- PC はメインカラム + サイドバー、モバイルは 1 カラムを基本にする。

Done:

- `@nuxt/ui` を導入する。
- Nuxt UI の semantic color を `app.config.ts` に定義する。
- 共通のデザイントークンを `app/assets/css/main.css` に定義する。

## Phase 2: Content Modeling

- 技術記事と読了本の管理方法を決める。
- Nuxt Content の collection を記事用・読了本用に分ける。
- Markdown frontmatter の項目を決める。

想定する記事 frontmatter:

```yaml
title: Next.js 14のApp Routerでブログを構築した話
description: App Routerを使ったブログ構築の記録
date: 2024-05-18
tags:
  - Next.js
  - React
thumbnail: /images/articles/nextjs-app-router.png
readingTime: 8
```

想定する読了本 frontmatter:

```yaml
title: エンジニアのためのドキュメントライティング
author: 著者名
date: 2024-05-10
rating: 4.5
category: 技術書
cover: /images/books/document-writing.png
```

## Phase 3: Top Page

- ヘッダー、ナビゲーション、検索ボタン、テーマ切替を作る。
- 記事一覧をカード形式で表示する。
- タグフィルターと並び替え UI を作る。
- 読了本一覧を横長カードで表示する。
- プロフィール、サイト説明、アーカイブをサイドバーに配置する。
- モバイルではサイドバー要素を本文下に回す。

## Phase 4: Detail Pages

- 記事詳細ページを作る。
- 読了本詳細ページを作るか、一覧のみで十分か判断する。
- Markdown 本文のタイポグラフィ、コードブロック、リンク、画像表示を整える。
- タグ、公開日、読了時間、関連記事を表示する。

## Phase 5: Navigation And Discovery

- タグ別ページを作る。
- 年別アーカイブを作る。
- 検索 UI を作る。
- 記事数が増えたらページネーションを入れる。

## Phase 6: Production Polish

- SEO メタ情報を整える。
- OGP 画像方針を決める。
- RSS とサイトマップを追加する。
- 404 ページを作る。
- `build` / `generate` が通ることを確認する。
- デプロイ先に合わせて設定を調整する。

## Working Notes

- UI 実装は Nuxt UI のコンポーネントを優先する。
- 細かい見た目は `app.config.ts` と `app/assets/css/main.css` のトークンを使って調整する。
- 記事や本のデータは、なるべく Markdown frontmatter に寄せる。
- 迷ったら小さく作って、実データを増やしながら調整する。

