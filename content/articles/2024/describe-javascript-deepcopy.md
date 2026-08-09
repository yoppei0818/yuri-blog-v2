---
title: JavaScriptのディープコピーとは？
description: JavaScriptのシャローコピーとディープコピーの違いを確認し、structuredCloneを使った実装方法と注意点を整理します。
publishDate: 2024-11-23
updated: 2024-11-23
published: true
tags:
  - JavaScript
thumbnail: /images/articles/describe-javascript-deepcopy.png
---

こんにちは、Yuriです。

今回は、JavaScriptにおけるオブジェクトのディープコピーについて紹介します。

シャローコピーとの違いや実装方法を理解しておくと、コピー先の変更が意図せずコピー元へ影響する問題を避けられます。

## ディープコピーとは？

ディープコピーとは、コピー元とコピー先が、内部にあるオブジェクトの参照を共有しないコピーのことです。

たとえば、入れ子になったオブジェクトをコピーしたあと、コピー先の内側にある値を変更しても、コピー元の値には影響しません。

詳しい定義は、[MDNのディープコピー](https://developer.mozilla.org/ja/docs/Glossary/Deep_copy)も参照してください。

## シャローコピーでは参照が共有される

まずは、`Object.assign()` を使ったシャローコピーを確認します。

```javascript
const original = {
  user: {
    name: 'Yuri',
  },
  settings: {
    theme: 'light',
  },
}

const shallowCopy = Object.assign({}, original)
```

`Object.assign({}, original)` で新しい外側のオブジェクトは作られますが、`user` や `settings` はコピー元と同じオブジェクトを参照しています。

```javascript
console.log(original === shallowCopy) // false
console.log(original.user === shallowCopy.user) // true
```

そのため、コピー先にある入れ子の値を変更すると、コピー元にも影響します。

```javascript
shallowCopy.user.name = 'Kohei'

console.log(original.user.name) // 「Kohei」
console.log(shallowCopy.user.name) // 「Kohei」
```

オブジェクトスプレッド構文も、同様にシャローコピーです。

```javascript
const shallowCopy = { ...original }
```

## structuredCloneでディープコピーする

ディープコピーには、`structuredClone()` を利用できます。

```javascript
const original = {
  user: {
    name: 'Yuri',
  },
  settings: {
    theme: 'light',
  },
}

const deepCopy = structuredClone(original)
```

`structuredClone()` で作ったコピーは、入れ子のオブジェクトもコピー元とは異なる参照になります。

```javascript
console.log(original === deepCopy) // false
console.log(original.user === deepCopy.user) // false
```

コピー先を変更しても、コピー元には影響しません。

```javascript
deepCopy.user.name = 'Kohei'

console.log(original.user.name) // 「Yuri」
console.log(deepCopy.user.name) // 「Kohei」
```

`structuredClone()` は通常のオブジェクトや配列だけでなく、`Date`、`Map`、`Set` など、構造化複製アルゴリズムが対応している型をコピーできます。また、循環参照を持つオブジェクトにも対応しています。

ただし、関数など構造化複製できない値が含まれている場合は `DataCloneError` が発生します。すべてのJavaScriptの値を無条件にコピーできるわけではありません。

詳しい対応範囲は、[MDNのstructuredClone()](https://developer.mozilla.org/ja/docs/Web/API/Window/structuredClone)を確認してください。

## JSONを使ったディープコピーの注意点

単純なデータだけを扱う場合、JSONへ変換して戻す方法もあります。

```javascript
const deepCopy = JSON.parse(JSON.stringify(original))
```

ただし、この方法はJSONとして表現できる値に限られます。

- `Date` は文字列へ変換される
- `undefined`、関数、`Symbol` などは正しく保持できない
- `BigInt` を含むと例外が発生する
- 循環参照を持つオブジェクトは変換できない

対象がJSON互換のデータだと分かっている場合には使えますが、一般的なディープコピーとしては `structuredClone()` の方が意図を表しやすく、扱える型も多くなります。

## まとめ

- `Object.assign()` とオブジェクトスプレッド構文はシャローコピーになる
- シャローコピーでは、入れ子のオブジェクトの参照がコピー元と共有される
- `structuredClone()` を使うと、対応している値をディープコピーできる
- `structuredClone()` でも、関数などコピーできない値がある
- JSONによるコピーは、JSON互換データだけに限定して使う

コピー方法を選ぶときは、対象のデータ構造と、コピー後にどの階層まで独立して変更したいかを確認することが大切です。
