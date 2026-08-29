---
title: GitHub上でStack PRをrebaseしたあとにローカルブランチを同期する方法
description: GitHub上でStack PRをrebaseしたあと、古いコミット履歴が残るローカルブランチをrebase済みのリモートブランチへ安全に同期する手順を紹介します。
publishDate: 2026-08-27
updated: 2026-08-29
published: true
tags:
  - Git
  - GitHub
thumbnail: /images/articles/sync-local-branch-after-stack-pr-rebase.png
---

こんにちは、Yuriです。

先日、GitHub上でStack PRをrebaseしたあと、ローカルブランチからpushしようとしたところ、`non-fast-forward` エラーが発生しました。

```text
! [rejected] branch-name -> branch-name (non-fast-forward)
error: failed to push some refs
```

rebaseによってコミット履歴がどう変わるかは理解していたものの、その結果をローカル環境へどう反映すればよいのか分かっていませんでした。

今回は、GitHub上でrebase済みのブランチを正として、ローカルブランチを安全に同期する方法を整理します。

::article-callout{type="caution" title="resetする前にローカルの変更を確認する"}
この記事では `git reset --hard` を使用します。<br>未コミットの変更やローカルにしかないコミットが不要であることを確認してから実行してください。
::

## rebase後にpushできなくなる理由

rebaseは、既存コミットの親を付け替えて履歴を並べ直す処理です。

コミットの変更内容が同じでも、親コミットが変わるとコミットIDも変わります。

### rebase前

```text
A---B---C       親ブランチ
     \
      D---E     子ブランチ
```

### rebase後

```text
A---B---C---D'---E'
```

`D` と `D'`、`E` と `E'` は変更内容がほぼ同じでも、Git上では異なるコミットです。

GitHub上でrebaseした場合、リモートブランチは新しい `D'` と `E'` を参照します。<br>一方、ローカルブランチは古い `D` と `E` を参照したままです。

```text
              D---E       ローカル
             /
A---B---C
             \
              D'---E'     リモート
```

ローカルの履歴がリモートの直接の続きではないため、通常のpushは拒否されます。コードの内容ではなく、コミット履歴が分岐していることが原因です。

## ローカルブランチを同期する

ここでは、次のブランチにいる状態で同期するものとします。

```text
feature/sample-docs
```

実行時は、自分が同期したいブランチ名へ置き換えてください。

### 1. 未コミットの変更を確認する

```bash
git status
```

次のように表示されれば、作業ツリーはクリーンです。

```text
nothing to commit, working tree clean
```

変更を残したい場合は、先にコミットするか、未追跡ファイルも含めてstashします。

```bash
git stash push -u -m "rebase後の同期前に一時退避"
```

### 2. リモートの最新情報を取得する

```bash
git fetch origin
```

`fetch` は、リモートの最新コミットとブランチ情報を取得します。<br>この操作だけでは、現在のローカルブランチや作業中のファイルは変更されません。

### 3. ローカルをリモートと同じ状態にする

```bash
git reset --hard origin/feature/sample-docs
```

このコマンドによって、次の状態がリモートブランチにそろいます。

- 現在のローカルブランチが参照するコミット
- ステージング領域
- Gitが追跡している作業ツリー上のファイル

なお、`git reset --hard` だけでは未追跡ファイルは削除されません。

## 実行コマンドのまとめ

未コミットの変更や残したいローカルコミットがない場合は、次の流れで同期できます。

```bash
git status
git fetch origin
git reset --hard origin/feature/sample-docs
```

ブランチ名は、実際に同期するブランチへ置き換えてください。

## git pullを使わない理由

GitHub上のブランチはrebase後の履歴、ローカルブランチはrebase前の履歴を参照している状態で `git pull` を実行すると、Gitはそれぞれの履歴を統合しようとします。

実際にpullしたところ、ローカルとリモートの履歴が分岐しているため、統合方法を指定するよう求められました。

```bash
git pull origin feature/sample-docs
```

```text
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
fatal: Need to specify how to reconcile divergent branches.
```

Gitは、分岐した履歴をmergeするのか、rebaseするのか、fast-forwardだけを許可するのかを自動では判断できません。

GitHub上で完了したrebase結果を正とするのであれば、古いローカル履歴を統合する必要はありません。

そのため、`fetch` でリモートの状態を取得し、内容を確認してから `reset --hard` でローカルを合わせる方法が明確です。

## force pushを使わない理由

GitHub上でrebaseした直後に古いローカルブランチからforce pushすると、GitHubが作った新しい履歴を古い履歴で上書きする可能性があります。

```bash
git push --force
```

この場面で必要なのは、リモートをローカルへ合わせることではなく、ローカルをrebase済みのリモートへ合わせることです。

```text
避けたい操作:
古いローカル履歴 → リモートへforce push

行いたい操作:
rebase済みリモート履歴 → ローカルへ反映
```

## ローカルの変更を残したい場合

### 未コミットの変更がある場合

未コミットの変更は、同期前にstashできます。

```bash
git stash push -u -m "rebase後の同期前に一時退避"
git fetch origin
git reset --hard origin/feature/sample-docs
git stash pop
```

ただし、rebase後のコードと変更箇所が重なっていると、`stash pop` 時にコンフリクトする可能性があります。

### 未pushのコミットがある場合

ローカルに必要なコミットがある場合は、コミットIDを控えるか、退避用ブランチを作ってから同期します。その後、必要なコミットをcherry-pickします。

```bash
git fetch origin
git log --oneline origin/feature/sample-docs..HEAD
git branch backup/sample-docs-before-sync
git reset --hard origin/feature/sample-docs
git cherry-pick <残したいコミットID>
```

cherry-pickでも、rebase後の変更と重なっている場合はコンフリクトの解消が必要です。

## 複数のStackブランチを同期する場合

GitHubのStack rebaseでは、Stack内の複数ブランチが更新されます。

ローカルでも複数の子ブランチを使い続ける場合は、`git fetch origin` を実行したあと、それぞれを対応するリモートブランチへ同期します。

```bash
git switch feature/sample-api
git reset --hard origin/feature/sample-api

git switch feature/sample-ui
git reset --hard origin/feature/sample-ui

git switch feature/sample-docs
git reset --hard origin/feature/sample-docs
```

作業を続ける最上位ブランチしか使わない場合は、ひとまずそのブランチだけ同期すれば作業を再開できます。あとから途中のブランチへ戻る場合は、その時点で同期が必要です。

## まとめ

GitHub上でStack PRをrebaseすると、リモート側のコミットIDが作り直されます。そのため、古い履歴を参照しているローカルブランチから通常のpushはできなくなります。

同期するときの基本方針は次のとおりです。

1. `git status` で未コミットの変更を確認する
2. 必要であればstashや退避用ブランチを作る
3. `git fetch origin` でrebase後の履歴を取得する
4. `git reset --hard origin/<ブランチ名>` で同期する
5. 古いローカル履歴からforce pushしない

rebase後にpushできなくなるのは異常ではありません。<br>GitHubとローカルが異なるコミット履歴を参照しているために起きる、Gitとして正常な挙動です。

今回の経験を通して、rebaseによる履歴の変化だけでなく、**どちらの履歴を正として、どちらを合わせるのか** を判断することが大切だと学びました。
