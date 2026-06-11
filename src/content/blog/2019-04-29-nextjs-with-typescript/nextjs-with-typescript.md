---
category: develop
tags:
  - javascript
  - xml
date: 2019-04-29
title: NextJS を TypeScript で開発する
vssue-title: nextjs-with-typescript
description: ""
---

NextJS は React を用いてサーバーサイドレンダリングに対応したサイトを作成するためのフレームワークです。

今回の記事は NextJS を TypeScript 開発するための手順書です。

やっていることは以下のリポジトリの Readme と変わりません。

[zeit/next-plugins](https://github.com/zeit/next-plugins/tree/master/packages/next-typescript)

## NextJS プロジェクトを作成

まずは NextJS のプロジェクトを作成しましょう。

```bash
mkdir next-project
cd next-project
npm init -y
npm install -s react react-dom next
mkdir pages
```

以上で完了です。

`"package.json"` に以下のスクリプトを仕込んでください。

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

NextJS では pages に格納された JS ファイルを Web ページとして表示できます。

たとえば、トップページ (index) を用意したいときは、pages/index.js に以下のようにすることでサイトを構築できます。

```js
const Index = () => {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
};
export default Index;
```

## TypeScript に対応させる。

NextJS の開発元の zeit が公式に TypeScript に対応させるプラグインを公開してくれています。

[zeit/next-plugins](https://github.com/zeit/next-plugins/tree/master/packages/next-typescript)

インストールしましょう。

```bash
npm install -s @zeit/next-typescript @types/react @types/react-dom
```

`next.config.js` を作成し、以下のコードを追記してください。

```js
// next.config.js
const withTypescript = require("@zeit/next-typescript");
module.exports = withTypescript();
```

`.babelrc` を作成し、以下のコードを追記してください。

```
{
  "presets": [
    "next/babel",
    "@zeit/next-typescript/babel"
  ]
}
```

`tsconfig.json` を作成し、以下のコードを追記してください

```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "preserve",
    "lib": ["dom", "es2017"],
    "module": "esnext",
    "moduleResolution": "node",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "preserveConstEnums": true,
    "removeComments": false,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "target": "esnext"
  }
}
```

以上で完了です。

`pages/index.js` の拡張子を `pages/index.tsx` に変更してください。

```bash
npm run dev
```

で正常にサイトが表示されたら、設定が完了しています。
