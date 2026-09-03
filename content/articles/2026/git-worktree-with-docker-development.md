---
title: Git worktreeでDocker開発しようとしてハマった話
description: Git worktreeで複数ブランチを並行開発したとき、変更が既存のDockerコンテナーへ反映されなかった原因を、bind mountの仕組みから整理します。
publishDate: 2026-09-03
updated: 2026-09-03
published: true
tags:
  - Git
  - Docker
thumbnail: /images/articles/git-worktree-with-docker-development.png
---

こんにちは、Yuriです。

最近、普段使うエディターをZed Editorへ乗り換えました。

Zed Editorで新しいスレッドを作る際にWorktreeを作成する選択肢があり、複数のブランチを並行して開発するのに便利そうだったため試してみました。

ブランチを切り替えるたびに作業中の変更をstashする必要がなく、AIエージェントへ別の作業を任せる場合にも相性が良さそうだと考えたためです。

ところが、worktree側でコードを変更しても、すでに起動していたDockerコンテナーへ変更が反映されませんでした。

最初は「同じGitリポジトリなのだから、worktree側の変更もコンテナーから見えるだろう」と、なんとなく考えていました。

しかし、Gitから見たリポジトリの関係と、Dockerが見ているホスト上のディレクトリは別の話です。

今回は、Git worktreeとDocker Composeを組み合わせてハマった原因と、複数のworktreeで開発環境を動かす方法を整理します。

## Git worktreeを使おうと思った理由

きっかけは、Zed EditorでAIエージェントのスレッドを作るときに、Worktreeを利用できることを知ったことでした。

スレッドごとに別のworktreeで作業できれば、普段の作業を続けながら、AIエージェントには別ブランチの実装を任せられます。

通常、1つの作業ディレクトリで同時にcheckoutできるブランチは1つです。

別のブランチへ移るには `git switch` などで切り替えますが、未コミットの変更があると、そのままでは切り替えられない場合があります。

一方、開発中には次のように複数の作業を並行して進めたいことがあります。

- 機能を実装しながら、別ブランチのレビュー指摘を修正する
- 長時間動く処理を待ちながら、別のタスクを進める
- 複数のAIエージェントに、それぞれ異なるブランチの作業を任せる

このような場面で、ブランチごとに独立した作業ディレクトリを用意できるGit worktreeが便利そうでした。

## Git worktreeとは

Git worktreeは、1つのGitリポジトリに複数の作業ツリーを追加できる仕組みです。

たとえば、メインの作業ディレクトリと同じ階層に、`feature/sample` ブランチ用のworktreeを作成します。

```bash
cd sample-app
git worktree add ../sample-app-feature feature/sample
```

ホスト上には、次の2つの作業ディレクトリが存在する状態になります。

```text
projects/
├── sample-app/          mainブランチの作業ディレクトリ
└── sample-app-feature/  feature/sampleブランチの作業ディレクトリ
```

それぞれのディレクトリでは、異なるブランチのファイルを同時に開いて編集できます。Gitのオブジェクトや一部の管理情報は共有しますが、作業ツリー上のファイルはディレクトリごとに別々です。

```text
1つのGitリポジトリ
├── worktree: sample-app/          → main
└── worktree: sample-app-feature/  → feature/sample
```

ここで重要なのは、**Git上では同じリポジトリに属していても、ホスト上では別のディレクトリである** という点です。

## worktree側の変更がDockerへ反映されなかった

もともと `sample-app/` では、Docker Composeを使ってアプリケーションを起動していました。

Composeファイルには、次のようなbind mountが設定されているものとします。

```yaml
services:
  app:
    build: .
    volumes:
      - .:/app
    ports:
      - "3000:3000"
```

この状態で `sample-app/` からコンテナーを起動します。

```bash
cd sample-app
docker compose up -d
```

`.:/app` は、ホスト側の相対パス `.` を、コンテナー側の `/app` へbind mountする指定です。Composeファイル内の相対的なホストパスは、基本的にComposeファイルのあるディレクトリを基準に解決されます。

今回のコンテナーが見ていたのは、`sample-app/` のファイルでした。

```text
ホスト
projects/
├── sample-app/ ───────────────────┐
│   └── src/                       │ bind mount
└── sample-app-feature/            │
    └── src/                       ▼
                              コンテナー
                              /app/
```

その後、`sample-app-feature/` でコードを変更しました。

```text
projects/sample-app-feature/src/
```

しかし、既存コンテナーの `/app` が参照しているのは、引き続き `sample-app/` です。`sample-app-feature/` はmountされていないため、そこで行った変更はコンテナーへ反映されません。

```text
sample-app/src/          → コンテナーの /app から見える
sample-app-feature/src/  → コンテナーの /app からは見えない
```

Dockerは、その2つが同じGitリポジトリのworktreeかどうかを考慮しません。bind mountで指定されたホスト上のパスだけを参照します。

つまり、今回の原因は次の認識が抜けていたことでした。

> Gitから見れば同じリポジトリの別worktree。でもDockerから見れば単なる別ディレクトリ。

「同じGitリポジトリ」と「同じディレクトリ」は別の話です。

## 解決方法1: worktreeごとにDocker Composeを起動する

アプリケーションもDBもブランチごとに分けたい場合は、worktreeごとにDocker Composeを起動します。

```bash
cd sample-app
docker compose -p sample-app-main up -d
```

```bash
cd sample-app-feature
docker compose -p sample-app-feature up -d
```

`-p` でComposeのproject名を分けると、コンテナーやネットワーク、Composeが管理する名前付きVolumeを別のリソースとして扱えます。

各worktreeにあるComposeファイルの `.:/app` は、それぞれのworktreeをmountします。

```text
sample-app/          → sample-app-mainのappコンテナー:/app
sample-app-feature/  → sample-app-featureのappコンテナー:/app
```

ただし、同じホストポートは同時に利用できません。ポート番号を環境変数にして、worktreeごとに変更できるようにします。

```yaml
services:
  app:
    build: .
    volumes:
      - .:/app
    ports:
      - "${APP_PORT:-3000}:3000"
```

たとえば、メイン側では3000番、feature側では3001番を使用します。

```bash
# sample-app/
APP_PORT=3000 docker compose -p sample-app-main up -d
```

```bash
# sample-app-feature/
APP_PORT=3001 docker compose -p sample-app-feature up -d
```

DBのポートもホストへ公開する場合は、同じように別の番号を割り当てる必要があります。アプリコンテナーからCompose内のDBへ接続するだけであれば、通常はDBのホスト側ポートを公開せず、サービス名とコンテナー側ポートで接続できます。

::article-callout{type="note" title="project名を省略した場合"}
Composeのproject名は、通常はComposeファイルのあるディレクトリ名などから決まります。worktreeのディレクトリ名が異なれば自動的に分かれる場合もありますが、`-p` や `COMPOSE_PROJECT_NAME` で明示すると、どの環境のリソースなのか判断しやすくなります。
::

## 解決方法2: 共通サービスだけDockerで起動する

もう1つの方法は、DBやRedisなどの共通サービスだけをDockerで起動し、アプリケーションは各worktreeのホスト上で起動する構成です。

```text
sample-app/          ── アプリをlocalhost:3000で起動 ─┐
                                                       ├─ Docker上のDB、Redis
sample-app-feature/  ── アプリをlocalhost:3001で起動 ─┘
```

たとえば、ComposeでDBとRedisだけを起動します。

```bash
docker compose up -d db redis
```

その後、各worktreeでアプリケーションの開発サーバーを別のポートで起動します。

```bash
cd sample-app
pnpm dev --port 3000
```

```bash
cd sample-app-feature
pnpm dev --port 3001
```

アプリケーションの起動が軽く、言語やパッケージの実行環境をホスト側へ用意できる場合は、この構成のほうがシンプルです。

ただし、DBを共有すると、ブランチごとのmigrationが同じDBへ影響します。アプリケーションだけを分けても、データやschemaまで分離されるわけではありません。

## 複数のworktreeでDockerを使うときの注意点

### ポートが競合する

複数のコンテナーや開発サーバーを同時に起動すると、同じホストポートを割り当てられません。

```text
Bind for 0.0.0.0:3000 failed: port is already allocated
```

アプリ、DB、デバッガーなど、ホストへ公開しているポートをworktreeごとに整理する必要があります。

### Docker Volumeが意図せず共有または分離される

Composeが管理する名前付きVolumeは、基本的にproject名の影響を受けます。project名を分けると、DBのVolumeも別になるのが通常です。

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

一方、Volumeに `name` を明示している場合やexternal Volumeを使っている場合は、project名を分けても同じVolumeを参照できます。

```yaml
volumes:
  db-data:
    name: sample-app-db-data
```

共有するつもりだったDBが空になったり、分離したつもりのDBを複数ブランチから共有したりしないよう、実際のVolume名を確認することが大切です。

### DBを共有したままmigrationを実行するのは危険

ブランチごとにmigrationの内容が違う場合、同じDBへ交互にmigrationを実行するとschemaとコードの対応が崩れる可能性があります。

たとえば、featureブランチでカラムを追加したあとに、mainブランチのコードから同じDBへ接続すると、想定していないschemaを参照することになります。カラムの削除や型変更を含むmigrationでは、データを失う危険もあります。

次のような場合は、DBやschemaもworktreeごとに分けたほうが安全です。

- 破壊的なmigrationを試す
- 複数ブランチで異なるmigrationを並行して作る
- テストデータをブランチごとに独立させたい

DBを共有する場合は、同時に実行するブランチ間でschemaに互換性があるかを確認し、必要なデータを事前にバックアップします。

::article-callout{type="caution" title="コンテナーを分けてもDBが分かれるとは限らない"}
接続先が同じ外部DBだったり、同じ名前付きVolumeを明示的に共有していたりすると、アプリコンテナーを分けてもデータは共有されます。コンテナー名だけでなく、接続先とVolumeの設定まで確認してください。
::

## どう使い分けるのが良さそうか

今回整理した構成は、次のように使い分けるのが良さそうです。

| 構成 | 向いている場面 | 注意点 |
| --- | --- | --- |
| worktreeごとにCompose一式を起動 | アプリ、DB、Redisなどをブランチ単位で独立させたい | 使用メモリやディスク容量が増える |
| 共通サービスだけDockerで起動 | アプリをホスト上で手軽に複数起動したい | 共有DBのmigrationに注意する |
| 1つのCompose環境だけ使う | 実行して確認するブランチを同時に1つへ絞れる | 別worktreeの変更は自動では反映されない |

環境を完全に分離したい場合は、worktreeごとにproject名、ポート、Volumeを分ける方法が分かりやすいです。

一方、DBやRedisの状態を共有しても問題がなく、アプリケーションをホスト上で起動できるなら、共通サービスだけをDockerへ任せる構成が扱いやすいと感じました。

## まとめ

Git worktreeを使うと、1つのGitリポジトリに複数の作業ディレクトリを用意し、異なるブランチを並行して編集できます。

しかし、Dockerのbind mountが参照するのは、設定で指定されたホスト上のディレクトリだけです。別のworktreeを作成しても、既存コンテナーのmount先が自動的に切り替わることはありません。

今回ハマった原因は、Gitが管理するリポジトリの単位と、Dockerが参照するディレクトリの単位を混同していたことでした。

> Gitから見れば同じリポジトリの別worktree。でもDockerから見れば単なる別ディレクトリ。

この違いを理解すると、worktreeごとにCompose環境を分けるべきか、DBなどだけを共有するべきかを判断しやすくなります。

Git worktreeとDockerを組み合わせるときは、ブランチだけでなく、**どのホストディレクトリを、どのコンテナーへmountしているのか** を確認することが大切だと学びました。
