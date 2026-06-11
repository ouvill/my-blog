---
category: develop
tags:
  - javascript
  - webpack
  - scss
date: 2019-04-15
title: webpack と Sass/SCSS の設定
vssue-title: webpack-Sass/SCSS
description: "webpack の開発環境を利用して、Sass/SCSS を自動的にコンパイルする環境を構築します。"
---

webpack の開発環境を利用して、Sass/SCSS を自動的にコンパイルする環境を構築します。

### 利用するもの

- webpack
- node-sass
- sass-loader

### プロジェクト生成

```
mkdir my-project
cd my-project
npm init -y
```

### weppack や node-scss のインストール

webpack や node-scss コンパイル時に必要になるだけなので`npm install` を `--save-dev` オプションをつけてインストールします

```bash
npm install --save-dev webpack webpack-cli node-sass sass-loader
```

['css-loader'](https://github.com/webpack-contrib/css-loader) と ['style-loader'](https://github.com/webpack-contrib/style-loader) も利用して、CSS ファイルをバンドルできるようにします。

```
npm install style-loader css-loader --save-dev
```

### webpack.config.js の設定

'scss' の拡張子では、sass-loader を利用するように指定します。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  }
};
```

### package.js の設定

`npm run build`, `npm run dev` で webpack のビルドが走るように設定します。

```js
{
 "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack --mode=development",
    "watch": "webpack --mode=development --watch"
 }
}
```

以上で環境の構築は完了です。

### サンプルコード

実際にサンプルを書いて動作を確認しましょう。

```js
// src/index.js
import "./scss/index.scss";
```

```scss
// src/scss/index.scss
div {
  h1 {
    color: blue;
  }
}
```

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html>
  <head> </head>

  <body>
    <div><h1>hello</h1></div>
    <h1>world</h1>
    <script src="../dist/main.js"></script>
  </body>
</html>
```

`src/index.js` では `src/scss/index.scss` をインポートしています。`src/scss/index.scss` は SCSS 記法で入れ子状にスタイルを指定しています。`src/index.html`では webpack の生成物の `dist/main.js` を読み込むように指定しています。

コンパイルします。

```bash
npm run build
```

コンパイルしたのち、ブラウザで `src/index.html` を開いてみると以下のようになります。

![動作例](./images/html.png)

SCSS の指定通り以下の場所だけに文字色が変わっていることが確認できます。

```html
<div><h1>hello</h1></div>
```

## まとめ

webpack を用いて、SCSS をバンドルする方法でした。

環境を導入し、正常に動作することが確認できました。

## 参考

[webpack-contrib/sass-loader](https://github.com/webpack-contrib/sass-loader)
