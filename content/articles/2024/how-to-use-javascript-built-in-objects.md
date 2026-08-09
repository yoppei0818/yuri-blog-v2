---
title: JavaScriptのビルトインオブジェクトのメソッドをどう使うか
description: JavaScriptでオブジェクト自身のプロパティを安全に確認する方法を、hasOwnPropertyとObject.hasOwnの違いから整理します。
publishDate: 2024-11-24
updated: 2024-11-24
published: true
tags:
  - JavaScript
thumbnail: /images/articles/how-to-use-javascript-built-in-objects.png
---

こんにちは、Yuriです。

今回は、プロジェクトで「なるほど」と思った、JavaScriptのビルトインオブジェクトのメソッドの使い方を紹介します。

具体的には、オブジェクトが自身のプロパティを持っているか、安全に確認する方法です。仕組みを知っておくと、オブジェクトに同名のメソッドが定義されている場合も意図した判定ができます。

## 「ビルトインオブジェクト」ってなに？

ビルトインオブジェクトは「組み込みオブジェクト」とも呼ばれ、JavaScriptの実行環境にあらかじめ用意されているオブジェクトです。

`Object`、`Array`、`String` など、さまざまな種類があります。

詳しくは、[MDNの標準組み込みオブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects)を参照してください。

## hasOwnPropertyをインスタンスから呼び出す

まずは、オブジェクト自身が `name` プロパティを持っているか、`hasOwnProperty()` で確認してみます。

```javascript
const obj = {
  name: 'Yuri',
}

obj.hasOwnProperty('name') // true
```

オブジェクトリテラルで作成した `obj` は、通常 `Object.prototype` を継承しています。そのため、`Object.prototype` に定義されている `hasOwnProperty()` を呼び出せます。

プロトタイプ継承については、[JavaScript.infoのプロトタイプ継承](https://ja.javascript.info/prototype-inheritance)も参考になります。

## インスタンスから呼び出す場合の問題

では、オブジェクト自身が `hasOwnProperty` という同名のメソッドを持っていたらどうなるでしょうか。

```javascript
const obj = {
  name: 'Yuri',
  hasOwnProperty() {
    console.log('Hello')
  },
}

obj.hasOwnProperty('name') // 「Hello」と出力される
```

先ほどは `true` を返していた呼び出しが、今度は `Hello` を出力しました。

`obj` 自身の `hasOwnProperty` が、プロトタイプから継承した同名メソッドよりも優先されたためです。外部から受け取ったオブジェクトなど、自分で構造を完全に管理できない値では、インスタンスから直接呼び出す方法は意図しない結果につながる可能性があります。

また、`Object.create(null)` で作ったオブジェクトは `Object.prototype` を継承しないため、そもそも `hasOwnProperty()` を持っていません。

```javascript
const obj = Object.create(null)
obj.name = 'Yuri'

obj.hasOwnProperty('name') // TypeError
```

## Object.hasOwnを使う

現在は、オブジェクト自身のプロパティを調べる場合、静的メソッドの `Object.hasOwn()` を使うと簡潔です。

```javascript
const obj = {
  name: 'Yuri',
  hasOwnProperty() {
    console.log('Hello')
  },
}

Object.hasOwn(obj, 'name') // true
```

第1引数に調べたいオブジェクト、第2引数にプロパティ名を渡します。対象のオブジェクトに同名の `hasOwnProperty` が定義されていても影響を受けません。

`Object.create(null)` で作ったオブジェクトにも使用できます。

```javascript
const obj = Object.create(null)
obj.name = 'Yuri'

Object.hasOwn(obj, 'name') // true
```

## 古い実行環境も考慮する場合

`Object.hasOwn()` を利用できない古い実行環境まで考慮する場合は、`Object.prototype.hasOwnProperty.call()` という書き方もできます。

```javascript
const obj = {
  name: 'Yuri',
  hasOwnProperty() {
    console.log('Hello')
  },
}

Object.prototype.hasOwnProperty.call(obj, 'name') // true
```

`call()` の第1引数に `this` として扱うオブジェクトを指定し、それ以降の引数を元のメソッドへ渡しています。

この例では `Object.prototype` が持つ本来の `hasOwnProperty()` を直接取得し、`obj` を `this` として呼び出しています。そのため、`obj` 自身に定義された同名メソッドの影響を受けません。

## まとめ

- オブジェクトリテラルは通常、`Object.prototype` のメソッドを継承する
- オブジェクト自身が同名メソッドを持つと、継承したメソッドは隠される
- `Object.create(null)` で作ったオブジェクトは `hasOwnProperty()` を継承しない
- 自身のプロパティを確認する場合は、基本的に `Object.hasOwn(obj, property)` を使う
- 古い実行環境も考慮する場合は、`Object.prototype.hasOwnProperty.call(obj, property)` を使える

オブジェクトの出所や構造を完全には把握できない場合も、インスタンスの同名メソッドに依存しない呼び出し方を選ぶと安全です。
