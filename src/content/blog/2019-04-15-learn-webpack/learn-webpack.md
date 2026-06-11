---
category: develop
tags:
  - javascript
  - webpack
date: 2019-04-15
title: webpack 入門
vssue-title: learn-webpack
description: "webpack は現代的な JavaScript アプリケーションの静的モジュールバンドラーです。複数のモジュールからなる JavaScript アプリケーションを一つにまとめます。 webpack の概要について説明します"
---

webpack の概要について説明します

<!-- more -->

## webpack とは

webpack は現代的な JavaScript アプリケーションの静的モジュールバンドラーです。
複数のモジュールからなる JavaScript アプリケーションを一つにまとめます。 ( バンドル - bundle )

## webpack はどのような動作をするのか サンプルコード

以下のような 2 つの JS ファイルがあるとします。`index.js`は`bar.js`に依存しています。配布するときは一つのファイルにまとめてしまえば、配布しやすいです。

```js
// src/index.js
import bar from "./bar";
bar();
```

```js
// src/bar.js
export default function bar() {
  //
}
```

以下のような webpack の設定ファイルを用意します。（必ずしも必要ではないです）
entry ポイント（プログラムの最初に呼び出すファイル）を指定し、`./dist/bundle.js` に生成結果を出力する設定をしています。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  }
};
```

生成した JS ファイルを読み込む HTML ファイルを用意します。

**src/index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <script src="../dist/bundle.js"></script>
  </body>
</html>
```

設定ファイルが用意できたら、`webpack` をコマンドラインで実行することで、`bundle.js`が生成されます。

## webpack のコンセプト

webpack は現代的な JavaScript アプリケーションの静的モジュールバンドラーです。

webpack を利用するにあたってコアとなるコンセプトを理解しておくといいでしょう。

- Entry
- Output
- Loaders
- Plugins
- Mode
- Browser Compatibility

### Entry

**エントリーポイント(entry point)** は内部依存関係グラフの関係を開始するために webpack がどのモジュールを使用すべきかを示します。webpack はどのモジュールやライブラリがそのエントリポイントに依存しているかを把握します。

デフォルト設定では `./src/index.js` になっています。ですが、別のファイルを指定したり、複数のエントリーポイントを指定できます。

**webpack.config.js**

```js
module.exports = {
  entry: "./path/to/my/entry/file.js"
};
```

### Output

**output** プロパティは webpack の生成物の配置先を指定できます。

デフォルト設定では`.dist/main.js`になっています。設定ファイルで`output`先を指定できます。

**webpack.config.js**

```js
const path = require("path");

module.exports = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  }
};
```

ファイルの先頭で`import`している`path`モジュールは Node.js のファイルパスを操作するためのコアモジュールです。

### Loader

初期設定の webpack では JavaScript と JSON ファイルのみを理解します。Loader を指定することで、他のファイルをモジュールとして追加することが可能になります。

`loaders` は二つのプロパティを持ちます。

1. `test` プロパティはどのファイルを変換すべきかを指定します
2. `use` プロパティはどのように変換するかを指定します。

**webpack.config.js**

```js
const path = require("path");

module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js"
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }]
  }
};
```

上記のように指定すると、webpack は '.txt'拡張子のファイルがモジュールとして `import` もしくは `require()` されているときは、 `raw-loader` で変換処理をされたのちバンドルされます。

::: warning

正規表現で拡張子を指定する時、引用符('',"") で囲まないように注意してください。

:::

### Plugins

`loader` は特定の拡張子のファイルを変換するのに用いられます.
`plugin` はバンドルの最適化、環境変数の設定などより広範囲のタスクを行います。

プラグインを使用するには、`require()` で読み込んだあと、`plugins` の配列に追記します。多くのプラグインはオプションでカスタマイズが可能です。

**webpack.config.js**

```js
const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const webpack = require("webpack"); //to access built-in plugins

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })]
};
```

例では `html-webpack-plugin` を利用しています。`html-webpack-plugin` は バンドル結果を付記した HTML ファイルを生成します。

### Mode

`development` , `production` , `none` のモードを指定できます。webpack はモードによって環境に適した最適化を行います。デフォルト値は `production` です。

```js
module.exports = {
  mode: "production"
};
```

### Browser Compatibility

webpack は ES5 準拠の全てのブラウザをサポートしています。

## まとめ

webpack の概要についてでした。

こちらのほうに webpack の環境構築について書いてあります。

[webpack 環境構築 - 導入手順](../2019-04-15--create-webpack-environment/create-webpack-environment.md)

## ライセンス

この記事は [https://webpack.js.org/](https://webpack.js.org/) を参考に作成されました。一部翻訳、引用を用いています。
