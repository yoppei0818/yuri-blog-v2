---
title: JavaScriptのthisの挙動について呼び出し元で整理する
description: JavaScriptのthisが何を参照するのか、メソッド呼び出しと関数呼び出しの違いから整理します。
publishDate: 2024-11-20
updated: 2025-03-21
published: true
tags:
  - JavaScript
thumbnail: /images/articles/describe-behavior-javascript-this.png
---

こんにちは、Yuriです。

今回は、プロジェクトや個人開発で振り回されることが多かったJavaScriptの `this` の挙動について、あらためて振り返ります。自分をはじめ、初学者の方も知っておくと開発が楽になるかと思います。

## そもそも「this」ってなんだ？

`this` は、関数が実行されたときのコンテキストを参照するためのキーワードです。

同じ関数であっても、どのように呼び出されたかによって `this` が参照する値は変わります。この特徴が便利なところでもあり、難しいところでもあります。

それでは、呼び出し方によって参照先がどう変わるのか見てみましょう。

## 使用する場所ごとのthis

この記事では、`this` を使用するケースを次の2つに分けて確認します。

- オブジェクトのメソッドとして呼び出す場合
- 通常の関数として呼び出す場合

## オブジェクトのメソッドとして呼び出す場合

オブジェクトのメソッドとして呼び出した場合、`this` は基本的に呼び出し元のオブジェクトを参照します。

ここでいう呼び出し元のオブジェクトとは、次の例では `obj` のことです。

```javascript
const obj = {}
```

実際に挙動を見てみましょう。

```javascript
const obj = {
  name: 'Yuri',
  message: function () {
    console.log('Hello ' + this.name)
  },
}

obj.message()
```

この例では、`Hello Yuri` と出力されます。

`obj.message()` という形で呼び出しているため、メソッド内の `this` は `obj` を参照します。したがって、`this.name` は `obj.name` として評価されます。

## 通常の関数として呼び出す場合

通常の関数として呼び出した場合、`this` の値は実行モードによって異なります。

- 非厳格モードのブラウザでは、`this` はグローバルオブジェクトの `window` を参照する
- 厳格モードやES Modulesでは、`this` は `undefined` になる

次のコードは、ブラウザの非厳格モードで実行する例です。

```javascript
window.name = 'Yuri'

function message() {
  console.log('Hello ' + this.name)
}

message()
```

非厳格モードでは `this.name` が `window.name` として評価されるため、`Hello Yuri` と出力されます。

> `let` や `const` で宣言した変数は、`window` オブジェクトのプロパティとして追加されません。一方、ブラウザでトップレベルに `var` を使って宣言した変数は、`window` のプロパティになります。

現在のフロントエンド開発ではES Modulesが広く使われています。ES Modulesは自動的に厳格モードとして扱われるため、通常の関数呼び出しで `this` に依存する実装は避けた方が安全です。

## オブジェクトのメソッドを変数へ代入した場合

ここまでを踏まえて、オブジェクトのメソッドを変数へ代入した場合の挙動を見てみましょう。

```javascript
const obj = {
  name: 'Yuri',
  message: function () {
    console.log('Hello ' + this.name)
  },
}

const message = obj.message
message()
```

`const message = obj.message` では、関数そのものを変数へ代入しています。その後は `obj.message()` ではなく `message()` として呼び出しているため、`this` と `obj` の結び付きは失われます。

非厳格モードでは `this` が `window` を参照します。`window.name` が設定されていなければ、実行環境に応じて空文字などが返ります。

厳格モードやES Modulesでは `this` が `undefined` になるため、`this.name` を読み取ろうとすると `TypeError` が発生します。

このような場合は、`bind()` を使って `this` の参照先を固定できます。

```javascript
const message = obj.message.bind(obj)
message() // 「Hello Yuri」と出力される
```

## まとめ

`this` の参照先は、関数を定義した場所だけではなく、主に関数の呼び出し方によって決まります。

- `obj.message()` のようなメソッド呼び出しでは、`this` は `obj` を参照する
- `message()` のような通常の関数呼び出しでは、非厳格モードのブラウザなら `window`、厳格モードやES Modulesなら `undefined` になる
- メソッドを変数へ代入すると、元のオブジェクトとの結び付きは失われる
- 元のオブジェクトを参照させたい場合は、`bind()` で `this` を固定できる

`this` で迷ったときは「この関数はどのような形で呼び出されているか」を確認すると、参照先を判断しやすくなります。
