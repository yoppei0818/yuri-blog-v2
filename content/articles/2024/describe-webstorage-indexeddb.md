---
title: Web StorageとIndexedDBについて整理する
description: localStorage、sessionStorage、IndexedDBの違いを、保存形式、同期・非同期、データの寿命、用途から整理します。
publishDate: 2024-12-22
updated: 2024-12-22
published: true
tags:
  - Web Storage
  - IndexedDB
thumbnail: /images/articles/describe-webstorage-indexeddb.png
---

こんにちは、Yuriです。

Todoアプリを作った際にIndexedDBを利用したのですが、ブラウザにデータを保存する方法としてはWeb Storageもあります。

今回は、`localStorage`、`sessionStorage`、IndexedDBの特徴と使い分けを整理します。

## ブラウザにデータを保存する仕組み

Web StorageとIndexedDBは、どちらもブラウザ側にデータを保存するためのWeb APIです。

保存したデータが自動的にサーバーへ送信されることはなく、同一オリジンの制約を受けます。ただし、保存容量やデータが削除される条件はブラウザや利用状況によって異なるため、永続性を前提にしすぎないことが大切です。

主な違いは次のとおりです。

| 項目 | localStorage | sessionStorage | IndexedDB |
| --- | --- | --- | --- |
| 保存形式 | 文字列のキーバリュー | 文字列のキーバリュー | オブジェクトやBlobなど |
| API | 同期 | 同期 | 非同期 |
| データの範囲 | 同一オリジン | 同一オリジンかつタブ単位 | 同一オリジン |
| データの寿命 | 明示的に削除されるまで | タブを閉じるまで | 明示的に削除されるまで |
| 得意な用途 | 小さな設定値 | 一時的な入力状態 | 大量・構造化データ |

## localStorage

`localStorage`は、文字列をキーバリュー形式で保存する同期APIです。

ブラウザやタブを閉じてもデータが残るため、テーマや表示設定など、小さく単純なデータの保存に向いています。

```javascript
localStorage.setItem('theme', 'dark')

const theme = localStorage.getItem('theme')

localStorage.removeItem('theme')
```

値は文字列として保存されます。オブジェクトを扱う場合は、保存時に`JSON.stringify()`、取得時に`JSON.parse()`が必要です。

```javascript
const settings = {
  theme: 'dark',
  fontSize: 16,
}

localStorage.setItem('settings', JSON.stringify(settings))

const storedSettings = JSON.parse(
  localStorage.getItem('settings') ?? '{}',
)
```

同期APIのため、大きなデータを頻繁に読み書きするとメインスレッドを塞ぐ可能性があります。

## sessionStorage

`sessionStorage`も、文字列をキーバリュー形式で保存する同期APIです。基本的な操作方法は`localStorage`と同じです。

```javascript
sessionStorage.setItem('draft', '入力途中の内容')

const draft = sessionStorage.getItem('draft')
```

ページを再読み込みしてもデータは残りますが、保存領域はタブごとのページセッションに分かれ、タブを閉じるとデータも削除されます。

そのため、フォームの入力途中の状態や、画面遷移中だけ保持したい一時的な情報に向いています。

## IndexedDB

IndexedDBは、大量の構造化データをブラウザへ保存するための非同期APIです。

JavaScriptのオブジェクトだけでなく、ファイルやBlobなども保存できます。また、オブジェクトストア、インデックス、トランザクションを利用できるため、検索や更新を伴うデータ管理に向いています。

```javascript
const request = indexedDB.open('todo-app', 1)

request.onupgradeneeded = () => {
  const database = request.result

  if (!database.objectStoreNames.contains('todos')) {
    database.createObjectStore('todos', {
      keyPath: 'id',
      autoIncrement: true,
    })
  }
}

request.onsuccess = () => {
  const database = request.result
  const transaction = database.transaction('todos', 'readwrite')
  const todos = transaction.objectStore('todos')

  todos.add({ title: '記事を書く', completed: false })
}
```

Web Storageよりも扱う概念は多いものの、次のような用途で力を発揮します。

- オフラインでも利用するアプリ
- Todoやメモなど、件数が増えるデータ
- 検索や並び替えにインデックスを使いたいデータ
- 画像やファイルを含むデータ

## 保存容量とデータの削除

ブラウザストレージの容量は、特定の数値をどの環境でも保証できるものではありません。ブラウザ、端末の空き容量、ユーザー設定などによって変わります。

利用状況はStorage APIから概算できます。

```javascript
const estimate = await navigator.storage.estimate()

console.log(estimate.usage)
console.log(estimate.quota)
```

::article-callout{type="caution" title="ブラウザストレージを唯一の保存先にしない"}
保存したデータは、ユーザーによるサイトデータの削除や、ブラウザのストレージ管理によって失われる場合があります。失われると困るデータはサーバーにも保存しましょう。
::

## セキュリティ上の注意

Web StorageとIndexedDBは、認証された同一オリジンのJavaScriptからアクセスできます。

::article-callout{type="warning" title="機密情報の保存に注意する"}
クロスサイトスクリプティング（XSS）が発生すると、保存内容を読み取られる可能性があります。アクセストークンや個人情報などの機密情報を、安易に保存しないようにしましょう。
::

## どれを選ぶか

選び方を簡単にまとめると、次のようになります。

- 小さな設定をブラウザを閉じた後も残したい場合は`localStorage`
- タブを開いている間だけ一時的に残したい場合は`sessionStorage`
- 大量のデータや構造化データを非同期で扱いたい場合はIndexedDB

Web Storageは手軽ですが、同期APIであり文字列しか保存できません。データ量が増えるアプリや、検索・更新を伴うデータにはIndexedDBを検討するとよいでしょう。

## まとめ

Web StorageとIndexedDBは、どちらもブラウザ側へデータを保存できますが、得意な用途が異なります。

保存するデータの量や形式だけでなく、同期処理による影響、データを保持する期間、失われた場合の影響まで考えて選ぶことが大切です。
