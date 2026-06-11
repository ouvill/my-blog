---
category: develop
tags:
  - javascript
  - react
  - typescript
date: 2019-04-16
title: TypeScript + React で 三目並べを作った
vssue-title: react-tutorial-with-typescript
description: " TypeScript + React で 三目並べを作った"
---

この記事は日記。

なんだよ、解説じゃないのかよって？

まあ、このサイト自体、ブログとして作成しているので許してくだせえ。機会があれば、「React + TypeScript で作る三目並べ」という記事でも作成するつもり。

TypeScript + React で React 公式が紹介している Tutorial を行っていた。

わざわざ TypeScript で使ったのは、最近 TypeScript で作ってあるプログラムをよく見るようになっていたから。

こちらの記事が参考になった。

[TypeScript を使って react のチュートリアルを進めると捗るかなと思った(実際捗る)](https://qiita.com/m0a/items/d723259cdeebe382b5f6#%E6%89%8B%E7%95%AA%E3%81%AE%E5%87%A6%E7%90%86)

注意するべきところは TypeScript では コンポーネントの `props` と `state` に インターフェースを用意してあげるということ。

```typescript
interface HelloProps {
  name: string;
}

interface HelloState {
  count: number;
}

class Hello extends React.Component<HelloProps, HelloState> {
  constructor(props: HelloProps) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    const name = this.props.name;
    const message = "hello " + name + "!";
    return <div className="hello">{message}</div>;
  }
}
```

上記のソースコードだと `Hello` というコンポーネントは、`props` に string 型の`name` を受け取るし、`state` に `count` という数字を保持すると定義している。（なお今回のプログラムでは `state` を変更する処理を追加していないので、ずっと`state`は変わらないまま）

わざわざインターフェースを定義するのは面倒くさい気もするけども、インターフェースを定義しているお陰で、コンポーネントが受け取る値を把握できる。もし間違っている型を引数に与えてしまっていたら、コンパイル時に指摘してくれる。エディターの設定によっては書いている途中で、エラーを指摘してくれる。

作成したプログラムはせっかくなので公開した。

デプロイ先は Netlify。

[作成したプログラムの公開先](https://hopeful-hermann-a2868c.netlify.com/)

[作成したプログラムのソースコード](https://github.com/Ouvill/react-tutorial)

## 参考

- [Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)
- [TypeScript を使って react のチュートリアルを進めると捗るかなと思った(実際捗る)](https://qiita.com/m0a/items/d723259cdeebe382b5f6#%E6%89%8B%E7%95%AA%E3%81%AE%E5%87%A6%E7%90%86)
