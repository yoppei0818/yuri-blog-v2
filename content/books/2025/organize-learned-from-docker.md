---
title: Docker&仮想サーバー完全入門
author: リブロワークス
publishDate: 2025-02-22
published: true
tags:
  - Docker
publisher: インプレス
---

『[Docker&仮想サーバー完全入門](https://book.impress.co.jp/books/1121101138)』を読了したため、本書を通して学んだことをまとめます。

まだ1周目で理解が浅い部分もあるため、Dockerを実際に使いながら必要に応じて追記していきます。

## Dockerでホスト環境への影響を抑える

Dockerを利用すると、アプリケーションに必要なランタイムやライブラリをコンテナ内にまとめられます。

ホストOSへ依存関係を直接インストールする場面を減らせるため、開発環境を整理しやすくなります。また、DockerfileやComposeファイルを共有することで、チーム内で環境を再現しやすくなります。

::article-callout{type="note" title="ホストOSから完全に独立するわけではない"}
コンテナはホストのカーネルやDocker Engineを利用します。ボリューム、ポート、CPUアーキテクチャなど、ホスト環境との接点がなくなるわけではありません。
::

## Dockerコマンドで操作対象を明示する

Docker CLIには、操作対象を含めて記述するコマンドがあります。

```bash
docker container run nginx
docker image pull nginx
docker volume ls
docker network ls
```

`container`、`image`、`volume`、`network`のように対象が明示されるため、何を操作するコマンドなのか把握しやすくなります。

一方で、次の短い形式も現在利用できます。

```bash
docker run nginx
docker pull nginx
```

短い形式を古いという理由だけで避ける必要はありません。学習時には対象を含む形式も知っておくと、CLIの構造を理解しやすいと感じました。

## Docker Compose V2を利用する

現在のCompose CLIでは、ハイフンのない`docker compose`を使用します。

```bash
docker compose up
docker compose down
```

旧Compose V1で使われていた`docker-compose`とはコマンド形式が異なります。Docker DesktopにはCompose CLIが含まれているため、基本的には`docker compose`を利用します。

## Composeファイルは`compose.yaml`を使う

Composeファイルの推奨ファイル名は`compose.yaml`です。

```text
compose.yaml
```

`compose.yml`も利用できます。また、`docker-compose.yaml`と`docker-compose.yml`も後方互換性のためサポートされています。

複数の候補が同じ場所にある場合は`compose.yaml`が優先されるため、新しく作る場合はこの名前へ揃えると分かりやすくなります。

## トップレベルの`version`は不要

以前のComposeファイルでは、先頭に次のような`version`を書く例がありました。

```yaml
version: '3'

services:
  web:
    image: nginx
```

現在、トップレベルの`version`は後方互換性のために残されたobsoleteな項目です。指定してもComposeは最新のスキーマでファイルを検証するため、新しいComposeファイルでは省略します。

```yaml
services:
  web:
    image: nginx
```

## restart policyは用途に合わせて設定する

Composeのサービスには、コンテナを再起動する条件を`restart`で設定できます。

```yaml
services:
  web:
    image: nginx
    restart: always
```

`always`を指定したコンテナは、停止した場合やDockerデーモンが再起動した場合に再起動されます。

常時稼働が必要なサービスでは便利ですが、学習用コンテナへ一律に指定すると、Docker起動時に意図しないコンテナまで立ち上がることがあります。必要性を考えて設定することが大切です。

主なrestart policyには次があります。

| 値 | 動作 |
| --- | --- |
| `no` | 自動的に再起動しない |
| `on-failure` | エラー終了した場合に再起動する |
| `always` | 停止した場合に常に再起動する |
| `unless-stopped` | 明示的に停止されていない限り再起動する |

## コンテナのログを確認する

Composeで起動したサービスのログは`docker compose logs`で確認できます。

```bash
docker compose logs
```

サービスを指定すると、対象のログだけを表示できます。

```bash
docker compose logs web
```

ログを継続して追いかける場合は`--follow`、末尾の行数を限定する場合は`--tail`を使用します。

```bash
docker compose logs --follow --tail 100 web
```

## イメージを再ビルドする

Composeでイメージをビルドするには`docker compose build`を使います。

```bash
docker compose build
```

コンテナの起動前にビルドも実行したい場合は、`docker compose up`へ`--build`を付けられます。

```bash
docker compose up --detach --build
```

`docker compose up`は、サービスの設定やイメージが変更されている場合にコンテナを再作成します。ただし、Dockerfileやビルド対象を確実に再ビルドしてから起動したい場合は、`build`または`up --build`を明示すると意図が分かりやすくなります。

## Dev Containerで開発環境をコンテナ化する

VS CodeのDev Containers拡張機能を使うと、コンテナを開発環境として利用できます。

プロジェクト内の`.devcontainer/devcontainer.json`へ設定を記述し、コンテナ内のランタイム、ツール、VS Code拡張機能などを揃えられます。

```text
.devcontainer/
  devcontainer.json
```

ソースコードをコンテナへマウントし、ターミナル、補完、コードナビゲーション、デバッグなどを普段のVS Codeと近い操作感で利用できます。

環境構築手順を文章だけで共有するよりも、実行環境そのものを設定として共有できる点が便利だと感じました。

## まとめ

本書を通して、Dockerの基本操作だけでなく、Composeによる複数コンテナの管理や、開発環境をコンテナ化する考え方を学べました。

特に、次の点を今後の開発でも意識したいです。

- Docker CLIで何を操作しているか理解する
- Compose V2の`docker compose`を使う
- Composeファイルは`compose.yaml`へ揃える
- 不要な`version`を記述しない
- restart policyを用途に合わせて設定する
- ログ確認と再ビルドのコマンドを使い分ける
- Dev Containerで再現可能な開発環境を試す

Dockerはコマンドを覚えるだけでなく、イメージ、コンテナ、ボリューム、ネットワークの関係を実際に操作しながら理解していきたいです。
