---
category: develop
tags:
  - css
  - sass
  - web
date: 2019-04-15
title: Sass/SCSS 入門
vssue-title: learn-sass
description: "CSS 自体は HTML を装飾できて楽しいものです。ですが、スタイルシートは大きくなるにつれ、複雑になり保守性が低下します。プリプロセッサはこの状況を改善します。 CSS にはない、変数や入れ子、継承や CSS を書くことが楽しくなるその他機能を Sass は提供します。"
---

CSS 自体は HTML を装飾できて楽しいものです。ですが、スタイルシートは大きくなるにつれ、複雑になり保守性が低下します。プリプロセッサはこの状況を改善します。 CSS にはない、変数や入れ子、継承や CSS を書くことが楽しくなるその他機能を Sass は提供します。

<!-- more -->

## Sass/SCSS とは

公式サイトでは、以下のように書かれています。

> Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

世界でもっとも成熟した、安定した、そして強力なプロフェッショナルグレードの CSS 拡張言語です。

なかなか自信に満ちた宣伝文句ですね。

Sass はコンパイルすることで CSS ファイルを生成します。CSS よりも機能が拡張されており、よりプログラムチックに環境を記述できます。

## Sass をインストールする

Sass を解説している日本語記事を見ていると ruby を使ったインストール方法が紹介されています。ですが、いまでは [LibSass](https://sass-lang.com/libsass) という Sass エンジンの C/C++ 実装がリリースされています。LibSass を使った wrapper が多数開発されているため、今では ruby をインストールする必要もなく、 node で Sass の実行環境を用意できます。

以下のコマンドでローカル環境に node-sass をインストールできます。

```bash
npm install -D node-sass
```

## Sass/SCSS をコンパイルして CSS を生成する

`input.scss` という SCSS 記法で書かれたファイルは以下のコマンドでコンパイルできます。

```bash
npx node-sass input.scss output.css
```

またはこちらでもできる

```bash
npx sass input.scss output.css
```

'webpack' や 'babel' でコンパイルを実行することもできます。それについてはまた別の記事で作成します。

[webpack と Sass/SCSS の設定](../2019-04-15--webpack-scss/webpack-scss.md) に webpack と SCSS の設定方法を記述しました。

## Sass/SCSS ファイルの変更を監視して、即時にコンパイル

`--watch` オプション を利用することで、Sass/SCSS ファイルの変更を検知し、即時にコンパイルを行うことができます。

```bash
npx node-sass --watch input.scss output.css
```

フォルダの変更を検出する場合、以下のようにします。例では `app/sass` フォルダの変更を監視し、コンパイル結果の CSS を `public/stylesheets` に出力します。

```bash
npx node-sass --watch app/sass:public/stylesheets
```

## Sass/SCSS 記法

Sass では二つの記法があります。Sass 記法と SCSS 記法です。本記事では CSS と書き方が似ている SCSS 記法で解説します。ファイルの拡張子は `*.scss` となります。

## 変数

Sass では変数が使えます。変数の宣言は `$` を用います。変数にはフォントの色や種類、その他 CSS の値を格納できます。

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

変数に値を格納してしまえば、使い回すことも容易になります。サイトのテーマ色等を一括管理できるようになります。

## 入れ子

HTML が入れ子構造であるように Sass では入れ子で書くことができます。例として、サイトナビゲーションのスタイルを定義を書く場合以下のようになります。

ただし、過度な入れ子構造は可読性を低下させるためご注意ください。

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

`ul`, `li`, `a` 要素が `nav` の入れ子構造になっています。

## Partials ( 分割 )

Sass は 分割して記述することができます。モジュール化することで保守性を向上させます。モジュール化するためにはファイル名を`_partial.scss` のように、`_` (アンダーバー) で始めます。`_` がついたファイルは単体では CSS が生成されません。別の Sass ファイルに `@import` を記述し読み込ませます。

## Import

`@import` を利用することで 複数の Sass をインポートすることができます。

CSS でも `@import` を利用できます。ですが `@import` が実行されるたびに、新規の HTTP コネクションを生成します。

Sass の `@import` では、インポートされたファイルは CSS 生成時に埋め込まれ、単一の CSS を生成します。

```scss
// _reset.scss

html,
body,
ul,
ol {
  margin: 0;
  padding: 0;
}
```

```scss
// base.scss

@import "reset";

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

`@import` するときはファイル拡張子を必要としません。

## Mixins

CSS 3 では多数のベンダープレフィックスが存在します。mixin を利用すれば、再利用したい CSS 宣言のグループを作成することができます。mixin に引数を渡すこともできます。ベンダープレフィックスの例を示します。

```scss
@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}

.box {
  @include transform(rotate(30deg));
}
```

mixin を作成するために `@mixin` と記述し、`transform` という名前を宣言しています。`$property` を引数として与えることで、全ての変換に値を与えることができます。作成した mixin を利用するには `@include` で呼び出します。

## 継承

Sass では継承が利用可能です。`@extend` を利用することで CSS のプロパティを簡単に他のセレクターと共有することができます。

例では成功、失敗、警告メッセージを表示する場合を想定しています。`%equal-heights` のように継承されていない CSS は コンパイル時に生成物に含まれることはありません。

```scss
/* This CSS will print because %message-shared is extended. */
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

// This CSS won't print because %equal-heights is never extended.
%equal-heights {
  display: flex;
  flex-wrap: wrap;
}

.message {
  @extend %message-shared;
}

.success {
  @extend %message-shared;
  border-color: green;
}

.error {
  @extend %message-shared;
  border-color: red;
}

.warning {
  @extend %message-shared;
  border-color: yellow;
}
```

## 演算

Sass では`+`, `-`, `*`, `/`, `%` のような演算子が利用できます。横幅を計算するときなどに役立ちます。

```scss
.container {
  width: 100%;
}

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}

aside[role="complementary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```

ピクセル値を取得してからパーセンテージに変換するなどといった処理に役立ちます。

## 参考

[Sass: Syntactically Awesome Style Sheets](https://sass-lang.com/)
