---
title: Macの「システムデータ」が267GBに増えた原因はDockerだった
description: Macの容量不足をきっかけに「システムデータ」が267GBまで肥大化した原因を調査し、DockerのBuild Cache、Image、DB Volumeを整理した手順を紹介します。
publishDate: 2026-08-10
updated: 2026-08-10
published: true
tags:
  - Mac
  - Docker
thumbnail: /images/articles/resolve-mac-system-data-storage-shortage-with-docker.png
---

こんにちは、Yuriです。

Xcodeをインストールしてアプリ開発するため、一応MacBookのストレージを確認したところ、「システムデータ」が **267GB** まで増えていました、、

システムデータはmacOSがまとめて表示している領域で、ストレージ設定を見ただけでは、何に容量を使っているのか全然分かりませんでした。

そこでターミナルから使用量を調べた結果、主な原因は **Docker Desktopのデータ** でした。

今回は、原因を特定した手順と、DockerのBuild Cache、Image、Volumeを整理して空き容量を増やした方法を紹介します。

::article-callout{type="caution" title="削除前に必要なデータを確認する"}
この記事にはDockerのデータを削除するコマンドが登場します。必要なImageやVolumeまで削除しないよう、各コマンドの対象を確認し、DBなどの重要なデータは事前にバックアップしてください。
::

## Macのストレージ状況を確認する

macOSでは、次の順番でストレージの使用状況を確認できます。

```text
メニュー
  ↓
システム設定
  ↓
一般
  ↓
ストレージ
```

今回確認したときは、システムデータだけで267GBを使用していました。

```text
システムデータ  267GB
```

通常のファイル整理だけでは解消できそうになかったため、どのディレクトリが容量を使っているのか調べました。

## 容量を使っているディレクトリを調べる

まず、ホームディレクトリ直下の使用量を確認します。

```bash
du -h -d 1 ~ 2>/dev/null | sort -h
```

`du` はディレクトリごとの使用量を表示するコマンドです。`-d 1` を指定すると、1階層下までを集計できます。

結果を見ると、`~/Library` が約254GBを占めていました。

```text
254G  /Users/xxxxx/Library
```

次に、`~/Library` の内訳を確認します。

```bash
du -h -d 1 ~/Library 2>/dev/null | sort -h
```

ここでは、`Containers` が約210GBを使用していました。

```text
210G  /Users/xxxxx/Library/Containers
```

さらに、`Containers` の中を調べます。

```bash
du -h -d 1 ~/Library/Containers 2>/dev/null | sort -h
```

すると、Docker Desktopのコンテナーディレクトリが約210GBを占めていることが分かりました。

```text
210G  /Users/xxxxx/Library/Containers/com.docker.docker
```

macOS版のDocker Desktopは、Linuxコンテナーを動かすための仮想ディスクをMac上に保存しています。

そのためDockerのImage、Volume、Build Cacheなどが増えると、macOSではシステムデータとして大きく表示されることがあります。

## Dockerの使用量を確認する

Docker側の内訳は、次のコマンドで確認できます。

```bash
docker system df
```

今回の主な結果は次のとおりでした。

```text
TYPE            TOTAL     SIZE
Images          20        107.6GB
Containers      12        526MB
Local Volumes   46        100.2GB
Build Cache     196       73GB
```

特に容量が大きかったのは、次の3項目です。

| 項目 | 容量 |
| --- | ---: |
| Images | 107.6GB |
| Local Volumes | 100.2GB |
| Build Cache | 73GB |

`docker system df` の数値には共有レイヤーなども含まれるため、表示された値の合計が、そのままMac上で解放できる容量になるとは限りません。ただし、どの種類のデータから調べるべきかを判断する目安になります。

## Build Cacheを削除する

まず、最も整理しやすいBuild Cacheを削除しました。

```bash
docker builder prune -a
```

`-a` を付けると、現在使われていないBuild Cacheがまとめて削除されます。実行前には削除対象と確認メッセージが表示されます。

今回、Build Cacheは73GBから0Bになりました。

```text
73GB → 0B
```

Build CacheはDocker Imageをビルドするときに再利用される中間データです。削除しても必要に応じて再生成されますが、次回のビルドには時間がかかる場合があります。

## 不要なImageを整理する

次に、保存されているImageを確認しました。

```bash
docker images
```

まずは、タグがなく、コンテナーから参照されていないdangling imageを削除します。

```bash
docker image prune
```

今回の削除量は約2.4GBでした。

```text
Total reclaimed space: 2.355GB
```

すべての未使用Imageを対象にする `docker image prune -a` もありますが、次回の起動時に再取得が必要になるImageまで削除されます。今回は一覧を確認しながら、必要なImageを残して整理しました。

## 大きなVolumeの中身を調べる

Volumeごとの詳しい使用量は、次のコマンドで確認できます。

```bash
docker system df -v
```

確認したところ、開発用DBのデータを保存しているVolumeが84.28GBを使用していました。

```text
xxxxxx_db-store  84.28GB
```

このVolumeは現在利用しているプロジェクトのDBだったため、Volume自体は削除できません。そこで、DBの中に残っている不要な開発用スキーマを確認し、必要なデータではないことを確かめてから削除しました。

MySQLでは、次のSQLでスキーマを削除できます。

```sql
DROP SCHEMA schema_name;
```

::article-callout{type="caution" title="DROP SCHEMAは元に戻せない"}
`DROP SCHEMA` を実行すると、スキーマ内のテーブルやデータも削除されます。対象名をよく確認し、必要に応じてバックアップを取得してから実行してください。
::

不要なスキーマを整理した結果、Local Volumesの使用量は100.2GBから53.89GBまで減りました。

```text
100.2GB → 53.89GB
```

なお、使われていないVolumeをまとめて削除する場合は、次のコマンドを利用できます。

```bash
docker volume prune
```

VolumeにはDBなどの永続データが保存されていることがあります。名前や利用状況を確認せずに実行するのは避けたほうが安全です。

## 整理後の結果

整理前と整理後のDocker使用量は、次のようになりました。

| 項目 | 整理前 | 整理後 |
| --- | ---: | ---: |
| Images | 107.6GB | 50.4GB |
| Local Volumes | 100.2GB | 53.89GB |
| Build Cache | 73GB | 0B |

Build Cacheの削除と、不要なImage、DBスキーマの整理によって、Docker関連のデータを100GB以上削減できました。

Docker Desktopの仮想ディスクはスパースファイルとして管理されるため、Docker上でデータを削除しても、ファイル自体の見かけの最大サイズがすぐに小さくならない場合があります。実際の空き容量はmacOSのストレージ画面や `df -h` でも確認すると確実です。

## まとめ

Macのシステムデータが異常に増えた場合は、次の順番で調べると原因を絞り込めます。

1. `du` で `~/Library` の使用量を確認する
2. `~/Library/Containers` に大きなディレクトリがないか確認する
3. Docker Desktopが大きい場合は `docker system df` で内訳を確認する
4. 不要なBuild CacheやImageを整理する
5. 大きなVolumeは削除せず、保存されているデータの中身まで確認する

特にDocker Desktopを長期間使っていると、過去のBuild CacheやImage、開発用DBのデータが蓄積します。

Macの容量不足に気づいてから慌てないよう、定期的に次のコマンドで使用量を確認しておくと安心です。

```bash
docker system df
```

Macのシステムデータが数百GBまで増えている場合は、Docker Desktopのデータが原因になっていないか確認してみてください。
