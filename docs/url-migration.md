# 旧サイト URL 移行対応表

## 概要

旧ブログ `https://yuri-tech.com` から新ブログへの移行に伴う URL の対応方針をまとめます。

- 同じ内容を新サイトへ移行したページは、旧 URL から新 URL へ `301` リダイレクトする
- URL を維持できるページはリダイレクトを設定しない
- 同じ内容の移行先がないページは、無関係なトップページへ転送せず `404` とする
- Cloudflare Pages のリダイレクトは `public/_redirects` で管理する

## URL を維持するページ

以下のページは新サイトでも同じ URL を使用するため、リダイレクトは不要です。

| 旧 URL | 新 URL | 対応 |
| --- | --- | --- |
| `/` | `/` | 維持 |

## 301 リダイレクトするページ

### 固定ページと一覧

| 旧 URL | 新 URL | 理由 |
| --- | --- | --- |
| `/about` | `/profile` | プロフィールページへ移行 |
| `/blog/page/1` | `/articles` | 記事一覧へ移行 |
| `/blog/page/2` | `/articles` | 記事一覧へ統合 |

### 技術記事

| 旧 URL | 新 URL |
| --- | --- |
| `/blog/describe-behavior-javascript-this` | `/articles/2024/describe-behavior-javascript-this` |
| `/blog/describe-javascript-deepcopy` | `/articles/2024/describe-javascript-deepcopy` |
| `/blog/describe-webstorage-indexeddb` | `/articles/2024/describe-webstorage-indexeddb` |
| `/blog/how-to-use-javascript-built-in-objects` | `/articles/2024/how-to-use-javascript-built-in-objects` |
| `/blog/lately-learned-js-tip` | `/articles/2024/lately-learned-js-tip` |
| `/blog/learn-javascript-eventloop-from-runtime` | `/articles/2024/learn-javascript-eventloop-from-runtime` |
| `/blog/organize-learned-from-todo` | `/articles/2024/organize-learned-from-todo` |

### 読了本

| 旧 URL | 新 URL |
| --- | --- |
| `/blog/organize-learned-from-docker` | `/books/2025/organize-learned-from-docker` |

## 移行先を設けないページ

以下のページは新サイトに同一内容のページがないため、301 リダイレクトを設定しません。
本番切り替え後は新サイトの `404` ページを表示します。

### 未移行の記事

| 旧 URL | タイトル | 対応 |
| --- | --- | --- |
| `/blog/roadmap-todo-in-plan` | ロードマップ形式のTodoアプリを作る（設計編 Part.1） | 404 |
| `/blog/roadmap-todo-in-db` | ロードマップ形式のTodoアプリを作る（設計編 Part.2） | 404 |
| `/blog/roadmap-todo-in-directory` | ロードマップ形式のTodoアプリを作る（設計編 Part.3） | 404 |
| `/blog/stumbling-points-astro-tailwind-microcms` | Astro + TailwindCSS + microCMSでのスタイル適用つまずきポイント | 404 |
| `/blog/blog-opened` | Astro + microCMSで個人ブログを開設しました | 404 |

### Works

新サイトにはWorksを設けないため、一覧・詳細ともに移行先なしとします。

| 旧 URL | タイトル | 対応 |
| --- | --- | --- |
| `/work/page/1` | Works一覧 | 404 |
| `/work/todo-app-pwa` | Todo App（PWA） | 404 |
| `/work/react-clone-app` | Netflix Clone App | 404 |
| `/work/yuri-blog` | Yuri's Blog | 404 |

## リダイレクト実装時の確認事項

- 旧 URL の末尾に `/` がある場合とない場合の両方を確認する
- 旧 URL が `301` を返し、対応する新 URL が `200` を返すことを確認する
- リダイレクトが2回以上連続しないことを確認する
- 新 URL の canonical が `https://yuri-tech.com` を参照していることを確認する
- 移行先なしのページがトップへ転送されず、`404` を返すことを確認する
