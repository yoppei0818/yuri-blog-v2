---
title: JavaScriptのランタイム構成からイベントループを学ぶ
description: ブラウザのJavaScriptランタイムを構成するコールスタック、Web APIs、タスクキュー、マイクロタスクキューとイベントループの関係を整理します。
publishDate: 2024-11-25
updated: 2024-11-25
published: true
tags:
  - JavaScript
thumbnail: /images/articles/learn-javascript-eventloop-from-runtime.png
---

こんにちは、Yuriです。

今回は、JavaScriptのイベントループについて、動画「[JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue](https://www.youtube.com/watch?v=eiC58R16hb8)」で学んだ内容を整理します。

ブラウザでJavaScriptがどのように同期処理と非同期処理を扱っているのか、ランタイムを構成する要素から確認していきます。

## JavaScriptエンジンとホスト環境

ブラウザでJavaScriptを実行するためには、JavaScriptエンジンとブラウザというホスト環境が連携します。

JavaScriptエンジンはコードを解析・実行し、ブラウザはタイマー、ネットワーク通信、DOMイベントなどの環境固有の機能を提供します。

イベントループを理解するうえでは、次の要素を押さえておくと全体像が見えやすくなります。

- コールスタック
- Web APIs
- タスクキュー
- マイクロタスクキュー
- イベントループ

## コールスタック

コールスタックは、実行中の関数や実行コンテキストを管理するスタックです。

後から追加されたものが先に取り出される、後入れ先出し（LIFO）の構造になっています。

```javascript
function a() {
  console.log('a')
}

function b() {
  a()
}

function c() {
  b()
}

c()
```

このコードは、次の流れで実行されます。

1. `c()` がスタックへ追加される
2. `c()` から呼ばれた `b()` が追加される
3. `b()` から呼ばれた `a()` が追加される
4. `a()`、`b()`、`c()` の順に処理を終えてスタックから取り除かれる

1つの長い同期処理がコールスタックを占有すると、その処理が終わるまでクリックや描画など、同じスレッド上のほかの処理を進められません。

## Web APIs

Web APIsは、ブラウザというホスト環境が提供する機能です。

代表的なものには、次があります。

- Fetch API
- タイマー
- Geolocation API
- DOMイベント

JavaScriptからこれらの非同期APIを呼び出すと、ブラウザ側でタイマーの計測やネットワーク通信などが進みます。JavaScriptはその完了を待ってコールスタックを占有し続ける必要がないため、別のコードを実行できます。

```javascript
navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  error => console.error(error),
)

fetch('https://example.com/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

APIの処理が完了しても、コールバックがその場ですぐに実行されるとは限りません。実行可能になった処理は、タスクやマイクロタスクとしてキューへ登録されます。

## タスクキュー

タスクキューには、タイマーやイベントなどをきっかけに実行可能になったタスクが並びます。

代表的な例は次のとおりです。

- `setTimeout()` のコールバック
- ユーザー操作のイベントハンドラー
- メッセージイベント

`setTimeout()` に指定する時間は、コールバックが必ずその時間後に実行されるという意味ではありません。指定時間を経過したあとにタスクとして実行可能になるまでの最低待機時間です。

コールスタックや先に処理されるタスクが残っていれば、実際の実行はさらに遅くなります。

## マイクロタスクキュー

マイクロタスクキューには、主に次の処理が登録されます。

- Promiseの `then()`、`catch()`、`finally()`
- `queueMicrotask()` に渡したコールバック
- `MutationObserver` のコールバック

現在のタスクと同期処理が終わってコールスタックが空になると、次のタスクへ進む前にマイクロタスクキューが空になるまで処理されます。

マイクロタスクの実行中に新しいマイクロタスクが追加された場合も、同じタイミングで続けて処理されます。そのため、マイクロタスクを追加し続ける処理は、次のタスクや画面描画を遅らせる可能性があります。

## イベントループ

イベントループは、コールスタックと各キューの状態を見ながら、実行する処理を選び続けます。

ブラウザ上の流れを単純化すると、次のようになります。

1. 1つのタスクを実行する
2. コールスタック上の同期処理を最後まで実行する
3. マイクロタスクキューを空になるまで処理する
4. 必要に応じて画面を描画する
5. 次のタスクへ進む

## コードで実行順を確認する

タスクとマイクロタスクの実行順を、コードで確認してみましょう。

```javascript
console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

queueMicrotask(() => {
  console.log('microtask')
})

console.log('end')
```

出力順は次のようになります。

```text
start
end
promise
microtask
timeout
```

まず同期処理の `start` と `end` が出力されます。

続いて、登録された順にPromiseのコールバックと `queueMicrotask()` のコールバックがマイクロタスクとして実行されます。マイクロタスクキューが空になったあと、`setTimeout()` のコールバックが次のタスクとして実行されます。

## まとめ

- コールスタックは、実行中の関数をLIFOで管理する
- ブラウザは、タイマーやネットワーク通信などのWeb APIsを提供する
- タイマーやイベントのコールバックなどは、タスクとしてキューへ登録される
- Promiseのコールバックなどは、マイクロタスクとして登録される
- 現在のタスクが完了すると、次のタスクより先にマイクロタスクが処理される
- 長い同期処理や増え続けるマイクロタスクは、画面の応答を遅らせる可能性がある

非同期処理の実行順で迷ったときは、「現在の同期処理」「マイクロタスク」「次のタスク」の順に分けて考えると整理しやすくなります。

より詳しい実行モデルは、[MDNのJavaScript実行モデル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Execution_model)も参考になります。
