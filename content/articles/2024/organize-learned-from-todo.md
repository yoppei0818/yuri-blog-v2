---
title: Todoアプリのハンズオンで学んだことを整理する
description: React HooksとTypeScriptでTodoアプリを作るハンズオンを通して学んだ、HTML、JavaScript、React、TypeScriptのポイントを整理します。
publishDate: 2024-12-23
updated: 2024-12-23
published: true
tags:
  - React
  - TypeScript
thumbnail: /images/articles/organize-learned-from-todo.png
---

こんにちは、Yuriです。

今回は「[React Hooks と TypeScript でつくる Todo PWA ～入門 React ハンズオン～](https://zenn.dev/sprout2000/books/76a279bb90c3f3)」を進める中で学んだことを、次の4つに分けて整理します。

- HTML
- JavaScript
- React
- TypeScript

## HTML

### `autofocus`属性

`autofocus`は、ページの読み込み時や`dialog`要素の表示時に、指定した要素へ自動的にフォーカスするための属性です。

```html
<input type="text" autofocus>
```

1つの文書やダイアログ内では、複数の要素へ指定しないようにします。複数指定した場合、最初に見つかった要素がフォーカスされます。

::article-callout{type="caution" title="アクセシビリティへの配慮"}
ページを開いた直後にフォーカスが移動すると、スクリーンリーダー利用者やモバイル利用者を混乱させる場合があります。本当に自動フォーカスが必要かを検討して使用しましょう。
::

## JavaScript

### オブジェクトのプロパティ名を動的にする

オブジェクトリテラルのプロパティ名を角括弧で囲むと、式の評価結果をプロパティ名として使用できます。これは計算プロパティ名と呼ばれます。

```javascript
const key = 'sampleKey'

const sample = {
  [key]: 'sampleValue',
}

console.log(sample) // { sampleKey: 'sampleValue' }
console.log(sample[key]) // 'sampleValue'
```

入力項目の名前をキーとしてオブジェクトを更新する場合などに利用できます。

### Tree Shaking

Tree Shakingは、利用されていないコードをビルド結果から取り除く最適化です。

主にバンドラーがES Modulesの`import`と`export`を静的に解析し、参照されていないエクスポートを出力対象から除外します。

実際に削除できる範囲は、バンドラーの設定やコードに副作用があるかどうかによって変わります。

## React

### `createRoot`

`createRoot`は、Reactが管理するルートをブラウザのDOM要素へ作成するAPIです。作成したルートの`render`メソッドへReact要素を渡して表示します。

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('root要素が見つかりません')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`createRoot`へ渡したDOM要素の内側はReactが管理します。サーバー側でReactが生成したHTMLを再利用する場合は、`createRoot`ではなく`hydrateRoot`を使用します。

### stateを直接変更しない

Reactのstateに保存したオブジェクトや配列は、読み取り専用として扱います。値を直接変更せず、新しい値を作ってset関数へ渡します。

```tsx
setTodos(currentTodos =>
  currentTodos.map(todo =>
    todo.id === id
      ? { ...todo, completed: true }
      : todo,
  ),
)
```

配列を新しく作っても、その中にあるオブジェクトまでは自動的に複製されません。更新対象のオブジェクトもスプレッド構文などで新しく作る必要があります。

配列を更新する際は、次のように破壊的な操作を避けます。

| 操作 | 避けたい方法 | 利用する方法 |
| --- | --- | --- |
| 追加 | `push`、`unshift` | スプレッド構文、`concat` |
| 削除 | `pop`、`splice` | `filter`、`slice` |
| 置換 | 添字への代入、`splice` | `map` |
| 並び替え | 元配列への`sort` | コピー後に`sort` |

### 直前のstateを基に更新する

更新後のstateが更新前の値に依存する場合は、set関数へ値ではなく更新用の関数を渡します。

```tsx
setCount(currentCount => currentCount + 1)
```

Reactはイベントハンドラーの処理をまとめてからstateを更新することがあります。更新用関数を使うことで、その時点の最新のstateを基に次の値を計算できます。

### イベントハンドラーの命名

イベントを処理する関数には`handle`、propsとして受け渡すイベントには`on`を付けると役割が伝わりやすくなります。

```tsx
type TodoItemProps = {
  onChange: (id: number) => void
}

function TodoItem({ onChange }: TodoItemProps) {
  const handleChange = () => {
    onChange(1)
  }

  return <input type="checkbox" onChange={handleChange} />
}
```

これはReactが強制する規則ではありませんが、一貫した命名はコードを読みやすくします。

### propsの分割代入

propsを分割代入すると記述は短くなりますが、変数がprops由来なのかコンポーネント内で定義されたものなのか分かりにくくなる場合があります。

コンポーネントが大きくなった場合は、変数名やコンポーネントの責務を見直し、値の出所を追いやすくすることが大切です。

## TypeScript

### `document.getElementById`と`null`

`document.getElementById`の戻り値は`HTMLElement | null`です。対象の要素が存在しない可能性があるため、利用前に`null`を確認します。

```typescript
const container = document.getElementById('root')

if (!container) {
  throw new Error('root要素が見つかりません')
}
```

Non-nullアサーション演算子（`!`）で確認を省略することもできますが、実行時に要素が必ず存在することをTypeScriptが保証するわけではありません。

### `readonly`

プロパティへ`readonly`を指定すると、そのプロパティへの再代入を型チェックで防げます。

```typescript
type Todo = {
  readonly id: number
  title: string
}
```

`readonly`はコンパイル時の制約です。また、入れ子になったオブジェクトまで自動的に読み取り専用にするものではありません。

### イベントごとの型

Reactのイベントハンドラーでは、対象に応じたイベント型を利用できます。

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.checked)
}
```

イベント型だけでなく、`ChangeEventHandler<HTMLInputElement>`のようなハンドラー全体の型を付ける方法もあります。

### ジェネリクスの型引数へ制約を付ける

型引数に`extends`を指定すると、ジェネリクスで受け取れる型に必要なプロパティを保証できます。

```typescript
type Identifiable = {
  id: number
}

function findById<T extends Identifiable>(items: T[], id: number) {
  return items.find(item => item.id === id)
}
```

制約がなければ`T`にどのような型が渡されるか分からないため、関数内で`id`へ安全にアクセスできません。

### `keyof`型演算子

`keyof`は、オブジェクト型のプロパティ名からユニオン型を作る型演算子です。

```typescript
type Todo = {
  id: number
  title: string
}

type TodoKey = keyof Todo
// 'id' | 'title'
```

プロパティを追加・削除したときにユニオン型を手作業で更新する必要がなくなり、型定義との不整合を防ぎやすくなります。

### インデックスアクセス型

インデックスアクセス型を使うと、オブジェクト型から特定のプロパティの型を取り出せます。

```typescript
type Todo = {
  id: number
  title: string
}

type TodoId = Todo['id']
// number

type TodoValue = Todo[keyof Todo]
// number | string
```

### アンビエント宣言

`declare`を使うと、実装が別の場所に存在する値や型をTypeScriptへ伝えられます。JavaScriptライブラリや実行環境が提供するグローバル変数の型を補う場合などに使用します。

```typescript
declare const appVersion: string
```

一般的には`.d.ts`形式の型定義ファイルへ記述します。`declare`は実行時の値を作成しないため、実体が存在しなければ実行時エラーになります。

### メソッドの型注釈

オブジェクト型のメソッドは、メソッド構文と関数プロパティ構文のどちらでも表現できます。

```typescript
type Formatter = {
  format(value: string): string
}

type FormatterProperty = {
  format: (value: string) => string
}
```

両者には、継承や`strictFunctionTypes`における引数型の扱いなどで違いがあります。プロジェクト内で意図に合った書き方へ揃えることが大切です。

### 型ガード

型ガードは、実行時の確認を通して変数の型を絞り込む仕組みです。ユーザー定義型ガードでは、戻り値の型に型述語を指定します。

```typescript
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

const value: unknown = 10

if (isNumber(value)) {
  console.log(value.toFixed(2))
}
```

APIレスポンスなど外部から受け取った値は、型アサーションで決めつけるのではなく、実行時に検証してから利用すると安全です。

## まとめ

Todoアプリの実装を通して、HTML属性の使い方からReactのstate更新、TypeScriptの型操作まで、幅広い内容を学べました。

個々の構文を覚えるだけでなく、「なぜその書き方が必要なのか」を実際のアプリ開発と結び付けて理解することが大切だと感じました。
