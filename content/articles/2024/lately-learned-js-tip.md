---
title: 最近学んだJavaScriptのTipsをアウトプット
description: JavaScriptのネストしたオブジェクトの分割代入とオプショナルチェーンについて、コード例と注意点を交えて整理します。
publishDate: 2024-12-28
updated: 2024-12-28
published: true
tags:
  - JavaScript
thumbnail: /images/articles/lately-learned-js-tip.png
---

こんにちは、Yuriです。

今回は、最近学んだJavaScriptの小さなTipsとして、オブジェクトの分割代入とオプショナルチェーンを整理します。

## オブジェクトの分割代入

オブジェクトの分割代入を使うと、プロパティの値を取り出して変数へ代入できます。

```javascript
const user = {
  greeting: 'Hello',
  farewell: 'Bye',
}

const { greeting, farewell } = user

console.log(greeting) // 'Hello'
console.log(farewell) // 'Bye'
```

### ネストしたプロパティを取り出す

オブジェクトの中にオブジェクトがある場合は、データの構造に合わせて分割代入のパターンもネストできます。

```javascript
const user = {
  greeting: 'Hello',
  message: {
    farewell: 'Bye',
  },
}

const {
  greeting,
  message: { farewell },
} = user

console.log(greeting) // 'Hello'
console.log(farewell) // 'Bye'
```

この例で作られる変数は`greeting`と`farewell`です。`message`は、内側の`farewell`へたどるためのパターンとして使われているだけなので、変数として宣言されません。

```javascript
console.log(message)
// ReferenceError: message is not defined
```

::article-callout{type="note" title="親オブジェクトも使いたい場合"}
`message`自体と、その中の`farewell`を両方使いたい場合は、分割代入を分けるか、先に`message`を取り出してから再度分割代入します。
::

```javascript
const { message } = user
const { farewell } = message
```

### プロパティ名とは異なる変数名で受け取る

コロンの右側へ名前を書くと、プロパティ名とは異なる変数名で値を受け取れます。

```javascript
const user = {
  name: 'Yuri',
}

const { name: userName } = user

console.log(userName) // 'Yuri'
```

この場合も`name`という変数は作られず、作られるのは`userName`です。

## オプショナルチェーン（`?.`）

オプショナルチェーンは、参照の途中にある値が`null`または`undefined`だった場合、エラーを発生させずに`undefined`を返す演算子です。

```javascript
const user = {
  name: 'Yuri',
}

console.log(user.profile?.hobby) // undefined
```

`user.profile`は`undefined`ですが、`?.`を使っているため、その先の`hobby`へアクセスせず評価を終了します。

通常のプロパティアクセスではエラーになります。

```javascript
console.log(user.profile.hobby)
// TypeError: Cannot read properties of undefined
```

### 配列の要素へアクセスする

角括弧によるアクセスでは、`?.[]`の形で使用します。

```javascript
const items = [
  { name: 'Item 1' },
  { name: 'Item 2' },
]

console.log(items[1]?.name) // 'Item 2'
console.log(items[3]?.name) // undefined

const emptyItems = undefined

console.log(emptyItems?.[0]) // undefined
```

### 関数やメソッドを呼び出す

関数が存在するときだけ呼び出したい場合は、`?.()`を使用します。

```javascript
const actions = {
  greet: () => 'Hello',
}

console.log(actions.greet?.()) // 'Hello'
console.log(actions.sayGoodbye?.()) // undefined
```

プロパティが存在していても、その値が関数でなければ`TypeError`になります。`?.()`は「呼び出し可能かどうか」まで確認するものではありません。

### DOM要素へアクセスする

`querySelector`は対象が見つからなかった場合に`null`を返します。要素が存在するときだけプロパティを参照したい場合にも利用できます。

```javascript
const button = document.querySelector('.sample-button')

console.log(button?.textContent) // 要素がなければundefined
```

### 短絡評価される範囲

オプショナルチェーンでは、左側が`null`または`undefined`の場合、そのチェーンの残りは評価されません。

```javascript
let index = 0
const items = null

const item = items?.[index++]

console.log(item) // undefined
console.log(index) // 0
```

ただし、オプショナルチェーンが途切れた後のアクセスは保護されません。

```javascript
const user = null

user?.profile.name // undefined
(user?.profile).name // TypeError
```

括弧で区切ると、その後の`.name`は別のプロパティアクセスとして評価されます。

## `??`と組み合わせて既定値を設定する

オプショナルチェーンで取得した結果が`null`または`undefined`だった場合、ヌル値合体演算子（`??`）で既定値を設定できます。

```javascript
const user = {}

const hobby = user.profile?.hobby ?? '未設定'

console.log(hobby) // '未設定'
```

`||`は`0`、空文字列、`false`も右側の値へ置き換えますが、`??`が右側を返すのは`null`または`undefined`の場合だけです。

## オプショナルチェーンを使うときの注意点

オプショナルチェーンは条件分岐を簡潔にできますが、必須であるはずの値にまで使用すると、不具合を`undefined`として見逃す可能性があります。

次のように使い分けることが大切です。

- 値が存在しないことを仕様として許容する場合は`?.`を使う
- 値が必須の場合は明示的に確認し、存在しなければエラーとして扱う
- 取得結果に既定値が必要な場合は`??`を組み合わせる

## まとめ

ネストした分割代入を使うと、深い階層の値を簡潔に変数へ取り出せます。ただし、途中のプロパティ名がそのまま変数になるわけではありません。

オプショナルチェーンを使うと、`null`や`undefined`の可能性があるプロパティ、配列、関数へ安全にアクセスできます。便利さだけで多用せず、その値が本当に省略可能なのかを考えて使っていきたいです。
