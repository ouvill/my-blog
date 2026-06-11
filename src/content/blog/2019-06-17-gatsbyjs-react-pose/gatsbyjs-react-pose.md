---
title: "GatsbyJS のページ移動時にReact Pose でアニメーションを実装する"
subTitle: ""
description: ""
date: 2019-06-17
category: 'it'
tags:
  - react
  - web
  - svg
---

現在、静的サイトジェネレーターの GatsbyJS を利用してサイトを作成しています。

ページ遷移するときにフェードインフェードアウトのアニメーションを付与する方法について。

## React Pose 

React Pose ばアニメーションライブラリです。

[https://popmotion.io/pose/](https://popmotion.io/pose/)

日本語の参考記事

[ReactのアニメーションにReact Poseが便利](https://qiita.com/seya/items/096862b488258f719e03)

結構わかりやすくアニメーションを利用できるので、これを利用して GatsbyJS で作成したサイトにアニメーションを実装します。

## GatsbyJS と React Pose を組み合わせる

### マウント、アンマウントのアニメーション

React Pose には `PoseGroup` というコンポーネントがあります。[Enter/exit transitions](https://popmotion.io/pose/learn/react-exit-enter-transitions/)

コンポーネントがマウントされたときの状態、アンマウントされたときの状態を定義し、それにしたがってアニメーションさせることができます。

```jsx
import posed, { PoseGroup } from 'react-pose'

const Fade = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
})

const Page = ({ items }) => (
  <PoseGroup>
    <Fade key="key" >
        {/* コンテンツ  */}
        {/* <Main/>   */}
    </Fade>
  </PoseGroup>
)
```

`enter` にマウントされたときの状態、`exit`にマウントされていないときの状態を記述します。上記では `opacity`（透過度）を指定して、フェードインフェードアウトを実現しています。

`PoseGroup` は `key` の変化を監視して、コンポーネントがマウントされた、アンマウントされたを判別しています。

コンポーネントの中身は変化がなかったとしても、key の値を変えてやるとコンポーネントのマウント、アンマウントアニメーションが発火します。

### ページ遷移時のマウント、アンマウントアニメーション

ページ遷移したときにアニメーションを発火させたい場合、`key` に URL を与えてやればアニメーションさせることができます。

Gatsby ではページコンポーネントやテンプレートコンポーネントでは `props.location.pathname` でページ URL を取得できます。

なのでページ遷移のアニメーションを実装する場合、以下のようになります。

```jsx
import posed, { PoseGroup } from 'react-pose'

const Fade = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
})

const Page = ({ items }) => (
  <PoseGroup>
    <Fade key={props.location.pathname} >
        {/* コンテンツ  */}
        {/* <Main/>   */}
    </Fade>
  </PoseGroup>
)
```

### gatsby-browser.js の書き換え

以上を踏まえて、`gatsby-browser.js`を少し書き換えます。

```jsx
import React from "react"

import posed, { PoseGroup } from "react-pose"

const Transition = posed.div({
  enter: { opacity: 1, delay: 300, beforeChildren: true },
  exit: { opacity: 0 },
})

export const replaceComponentRenderer = ({ props, ...other }) => {
  const { component } = props.pageResources
  return (
    <PoseGroup>
      <Transition key={props.location.pathname}>
        {React.createElement(component, props)}
      </Transition>
    </PoseGroup>
  )
}
```

`replaceComponentRederer` を利用して、ルートコンポーネントに `PoseGroup` を配置します。これでページ遷移をしたとしても`PoseGroup`が常にマウントされた状態を維持します。

もう少し綺麗な実装方法がありそうな気もしますが、とりあえず、これで動作しているので良しとします。

### 実際の運用

このままルート要素にフェードイン、フェードアウトの処理を噛ませていたら、ページ移動のたびに一度ページが真っ白になってしまいます。

なので、私は実際には以下のようにしました

`gatsby-browser.js`

```jsx
import React from "react"

import posed, { PoseGroup } from "react-pose"

const Transition = posed.div({})

export const replaceComponentRenderer = ({ props, ...other }) => {
  const { component } = props.pageResources
  return (
    <PoseGroup>
      <Transition key={props.location.pathname}>
        {React.createElement(component, props)}
      </Transition>
    </PoseGroup>
  )
}
```

`src/compnents/Layout.js`

```jsx
const Fade = posed.div({
  enter: {
    opacity: 1,
    delay: 100,
  },
  exit: {
    opacity: 0,
  },
})

const Layout = () => (
    <div>
      <Header/>
      <Main><Fade>{children}</Fade></Main>
      <Footer/>
    </div>
)
```

各ページコンポーネントで利用している Layout コンポーネントに`Fade`コンポーネントを呼んでいます。

これでメインコンテンツのみをフェードさせることができます。

## まとめ

以上でページ遷移のアニメーションを実装できました。

## 参考

- [POSE](https://popmotion.io/pose/)
- [VilhelmNielsen/gatsby-with-react-pose](https://github.com/VilhelmNielsen/gatsby-with-react-pose)
