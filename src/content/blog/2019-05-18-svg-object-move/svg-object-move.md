---
title: "SVG Object をマウスでグリグリとドラッグする"
subTitle: "SVG Object をマウスドラッグする"
description: ""
date: 2019-05-18
category: 'it'
tags:
  - react
  - web
  - svg
---

SVG を利用して、ちょっとしたお絵かきアプリ的な物を作成しようと思いました。

簡単なベクターソフトみたいなものですね。

ベクターソフトだと、SVG オブジェクトはドラッグ可能にしたい。

SVG オブジェクトをドラッグするにはどうすればいいのだろうと、戸惑ったのでメモ。

なお、React + TypeScript で作成しています。

以下のような SVG を返すシンプルなコンポーネントから、中の `rect` オブジェクトをドラッグ可能にします。

```jsx
const SVGComponents = () => {
    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      <rect
        width="100"
        height="100"
        x="50"
        y="50"
        fill="#900"
        stroke="#666"
        strokeWidth="5"
      />
    </svg>
    )
}
```

### rect の x, y 座標を state 管理にする

`rect` をドラッグ可能にするには、マウスの動きに追従して rect の x,y 要素をアップデートすれば良いです。そのため、rect の x, y を react の state 管理にします。

せっかくなので、React Hook を利用しましょう。

```jsx{1,3,4,15,16}
import React, {useState} from "react"
const SVGComponents = () => {
    const [x, setX] = useState(50); // 追記
    const [y, setY] = useState(50); // 追記
    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="100"
        height="100"
        x={x} 
        y={y} 
        fill="#900"
        stroke="#666"
        strokeWidth="5"
      />
    </svg>
    )
}
```

これで rect の x, y 要素は state 管理になりました。

### 利用するイベント

つぎに rect の要素をドラッグ可能にします。利用するイベントは `onMouseUp` , `onMouseDown` , `onMouseMove` です。

- `onMouseDown` はオブジェクトがクリックされたときに発生するイベントです。
- `onMouseUp` はクリックが解除されたときに発生するイベントです。
- `onMouseMove` はオブジェクトの上をマウスが移動したときに発生するイベントです。

### ドラッグ中か判別

ドラッグできるようにしたいので、マウスのボタンが押下されているか判別します。

`isMouseDown` という変数を用意し、`onMouseDown`、`onMouseUp` イベントで、`true`、`false` を切り替えます。

```jsx{6-9,11-14,31,32}
const SVGComponents = () => {
    const [x, setX] = useState(50); 
    const [y, setY] = useState(50); 
    const [isMouseDown, setIsMouseDown] = useState(false)
    
    // マウス押下時
    const onMouseDown = (e) => {
        setIsMouseDown(true);
    }

    // マウス押下解除時
    const onMouseUp = (e) => {
        setIsMouseDown(false);
    }

    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="100"
        height="100"
        x={x} 
        y={y} 
        fill="#900"
        stroke="#666"
        strokeWidth="5"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    </svg>
    )
}
```

### マウスドラッグ中の座標を取得する

`isMouseDown` が `true` のときにマウスを座標を取得します。表示してあるページに対しての、マウスの座標を取得するには `event.pageX`、`event.pageY` を利用します。


```jsx{16-23,42}
const SVGComponents = () => {
    const [x, setX] = useState(50); 
    const [y, setY] = useState(50); 
    const [isMouseDown, setIsMouseDown] = useState(false)
    
    // マウス押下時
    const onMouseDown = (e) => {
        setIsMouseDown(true);
    }

    // マウス押下解除時
    const onMouseUp = (e) => {
        setIsMouseDown(false);
    }

    // マウス移動時
    const onMouseMove = (e) => {
        // マウス押下中
        if (isMouseDown) {
            const mouseX = e.pageX;
            const mouseY = e.pageY;   
        }
    }

    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="100"
        height="100"
        x={x} 
        y={y} 
        fill="#900"
        stroke="#666"
        strokeWidth="5"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </svg>
    )
}
```

::: tip

マウスの座標を取得する変数は他にもいくつかあります。以下のサイトがわかりやすかったです。

[マウスイベントで取得されるカーソル座標パラメータの整理(offset, page, screen, client) - Qiita](https://qiita.com/yukiB/items/31a9e9e600dfb1f34f76)

:::

### SVG の座標を取得する。

rect の x, y は親要素の svg からの相対位置になります。相対位置を取得するには「"マウスの座標" - "ページ左上から svg 要素の左上端の座標"」から計算できます。

ページ左上から svg の要素の左上端の座標を取得するには、svg 要素の `getBoundingClientRect()` メソッドで取得できます。

svg 要素を参照するために `useRef` を利用します。React Hook で追加されたメソッドです。`ref` で指定した要素にアクセスできます。

```jsx{1,6,25-30,40}
import React, {useState, useRef} from "react"
const SVGComponents = () => {
    const [x, setX] = useState(50); 
    const [y, setY] = useState(50); 
    const [isMouseDown, setIsMouseDown] = useState(false)
    const svgRef = useRef(null)
    
    // マウス押下時
    const onMouseDown = (e) => {
        setIsMouseDown(true);
    }

    // マウス押下解除時
    const onMouseUp = (e) => {
        setIsMouseDown(false);
    }

    // マウス移動時
    const onMouseMove = (e) => {
        // マウス押下中
        if (isMouseDown) {
            const mouseX = e.pageX;
            const mouseY = e.pageY;   
            
            const svgRect = svgRef.current.getBoundingClientRect();
            const relativeX = mouseX - svgRect.left;
            const relativeY = mouseY - svgRect.top;

            setX(relativeX);
            setY(relativeY);
        }
    }

    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      <rect
        width="100"
        height="100"
        x={x} 
        y={y} 
        fill="#900"
        stroke="#666"
        strokeWidth="5"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </svg>
    )
}
```

現在のコンポーネントを表示してみると以下のようになります。マウスが四角形の左上に貼り付いてしまっています。

<video style="width:100%;" controls>
    <source src="./images/movie1.mp4" type="video/mp4">
   <p>※ご利用のブラウザでは再生することができません。</p>
</video>

このままではよくありません。

四角形の左上からマウスまでの位置をギャップとして計算して、マウスが左上に張り付かないように設定しましょう。

```jsx{5,12-15,34-35}
import React, {useState, useRef} from "react"
const SVGComponents = () => {
    const [x, setX] = useState(50); 
    const [y, setY] = useState(50);
    const [gap, setGap] = useState({x: 0, y: 0})
    const [isMouseDown, setIsMouseDown] = useState(false)
    const svgRef = useRef(null)
    
    // マウス押下時
    const onMouseDown = (e) => {
        setIsMouseDown(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        setGap({ x: mouseX - rect.left, y: mouseY - rect.top });
    }

    // マウス押下解除時
    const onMouseUp = (e) => {
        setIsMouseDown(false);
    }

    // マウス移動時
    const onMouseMove = (e) => {
        // マウス押下中
        if (isMouseDown) {
            const mouseX = e.pageX;
            const mouseY = e.pageY;   
            
            const svgRect = svgRef.current.getBoundingClientRect();
            const relativeX = mouseX - svgRect.left;
            const relativeY = mouseY - svgRect.top;

            setX(relativeX - gap.x);
            setY(relativeY - gap.y);
        }
    }

    return (
   <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      <rect
        width="100"
        height="100"
        x={x} 
        y={y} 
        fill="#900"
        stroke="#666"
        strokeWidth="5"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </svg>
    )
}
```

これを表示させてみると、以下のようになります。

<video style="width:100%;" controls>
    <source src="./images/movie2.mp4" type="video/mp4">
   <p>※ご利用のブラウザでは再生することができません。</p>
</video>

マウスの動きに追従するように、四角形が動いていると思います。

以上です。

### 既知の問題

- マウスを高速に動かすとオブジェクトが追従できない。改善方法 - onMouseMove イベントを親要素で実行すると解決する。

## サンプルコード TypeScript Ver

今回作成したサンプルコードの TypeScript バージョンもアップしておきます。

```tsx 
import React, { useState, useRef } from "react";

const SVGComponents = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [gap, setGap] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // クリックされたとき
  const onMouseDown = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    setIsMouseDown(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    setGap({ x: mouseX - rect.left, y: mouseY - rect.top });
  };

  // マウスが離れたとき
  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  // マウスを移動中
  const onMouseMove = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (isMouseDown) {
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      if (svgRef && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const relativeX = mouseX - svgRect.left;
        const relativeY = mouseY - svgRect.top;
        setX(relativeX - gap.x);
        setY(relativeY - gap.y);
      }
    }
  };

  return (
    <svg
      version="1.1"
      width="1240"
      height="1754"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      <rect
        width="100"
        height="100"
        x={x}
        y={y}
        fill="#900"
        stroke="#666"
        strokeWidth="5"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </svg>
  );
};

export default SVGComponents;
```


参考

- [SVG 要素をドラッグで動かす](http://www.mnet.ne.jp/~tnomura/javascript/svg/svgmove.html)
