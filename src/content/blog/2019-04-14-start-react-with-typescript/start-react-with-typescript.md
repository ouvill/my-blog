---
category: develop
tags:
  - javascript
  - typescript
  - react
date: 2019-04-14
title: TypeScript を使う React プロジェクトを作成する
vssue-title: start-react-with-typescript
description: ""
---

TypeScript は JavaScript に型宣言やクラス宣言を用意に実装可能な上位互換のような言語です。React プロジェクトで TypeScript を利用する方法を調べました。

<!-- more -->

## TypeScript に最適化した React 環境を新規作成

'create-react-app' という node 製アプリがあります。これは React 学習するための環境や single-page アプリケーションの作成に最良のアプリです。これを利用することで簡単に TypeScript に対応した React 環境を作成できます。

```
npx create-react-app my-app --typescript
```

以下のコマンドを入力することでローカルホストにサーバーが立ち上がり、ライブプレビューが可能です。

```
cd my-app
npm start
```

::: warning

解説サイトによっては TypeScript 対応の React 環境を作成する場合、以下のようにかかれている場合もあります。こちらは TypeScript の環境を構築するための React の fork プロジェクト の成果物を利用します。ですが、公式 React が TypeScript をサポートしたため廃止予定です。

```
npx create-react-app my-app --scripts-version=react-scripts-ts
```

:::

## create-react-app をグローバルにインストールしてはいけない

create-react-app を `npm install -g` でインストールしてしまっていると、どうやら正常に動作しないようです。[create-react-app with --typescript doesn't work #6319](https://github.com/facebook/create-react-app/issues/6319#issuecomment-459627529)

以下のコマンドでグローバルから 'create-react-app' をアンインストールしてください。

```
npm uninstall -g create-react-app --save
```

## create-react-app をアンインストールしても正常に動作しないとき

アンインストールしたはずなのですが、私の場合一向に解決することができませんでした。バージョンの関係か、依存関係なのか……。

docker コンテナを使ってしまって create-react-app を呼び出すところからコンテナ化することにしました。こうしておけば、開発環境の node 環境に依存することがなくなります。

`my-app` というプロジェクトを作成する場合、以下のようなコマンドになります。`my-app` の名前は好みで変更してください。

```
docker run --rm -u $(id -u):$(id -g) -v ${PWD}:/app -w /app node npx create-react-app my-app --typescript
cd my-app
npm start
```

docker コマンドで使用しているオプションは以下のようなものです

| オプション                               | 説明                                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| -u                                       | Docker コンテナの実行ユーザーを指定。この場合、カレントユーザー                                      |
| --rm                                     | コンテナ終了時にコンテナを削除                                                                       |
| -v                                       | ローカルファイルをコンテナにマウント。今回の場合、カレントディレクトリをコンテナの `/app` にマウント |
| -w                                       | コンテナのワーキングディレクトリを指定                                                               |
| node                                     | node コンテナを指定                                                                                  |
| npx create-react-app my-app --typescript | コンテナ内で実行されるコマンド                                                                       |

## まとめ

TypeScript に対応した React の環境構築でした。

## 参考

[Static Type Checking - React](https://reactjs.org/docs/static-type-checking.html#typescript)
