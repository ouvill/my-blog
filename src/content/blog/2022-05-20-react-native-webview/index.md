---
title: "React NativeのWebビューでデータのやりとり"
subTitle: ""
description: ""
cover: ''
date: 2022-05-20
category: 'it'
---

## はじめに

こんにちは、おーびるです。

React Nativeではウェブサイトをアプリ内で表示する`react-native-webview`があります。

https://github.com/react-native-webview/react-native-webview

アプリとWEBサイト間のデータのやりとりについて覚え書きを書きます。

### インストール

```
$ yarn add react-native-webview
```

#### iOS

```
pod install
```

#### Android

`android/gradle.properties`に以下を追記

```
android.useAndroidX=true
android.enableJetifier=true
```

### 実装

WebViewコンポーネントの`source`にURLを指定することでサイトを表示できます。

```js
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class MyWeb extends Component {
  render() {
    return (
      <WebView
        source={{ uri: 'https://infinite.red' }}
      />
    );
  }
}
```

### Webサイトとアプリの連携

[参考：Communicating between JS and Native](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native)

#### アプリからWebサイトを操作する

`injectedJavaScriptBeforeContentLoaded`に文字列形式で記述されたJavaScriptをわたすことで、Webページを開いたときに任意のJavaScriptを実行できます。

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
    const runFirst = `
      window.isNativeApp = true;
      true; // note: this is required, or you'll sometimes get silent failures
    `;
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: 'https://github.com/react-native-webview/react-native-webview',
          }}
          injectedJavaScriptBeforeContentLoaded={runFirst}
        />
      </View>
    );
  }
}
```

上記サンプルのようにグローバル変数を定義しておくと、WebサイトのJavaScriptからも利用できます。

```javascript
window.isNativeApp = true
```

#### Webサイトからアプリに情報伝達

Webサイトからアプリに情報を伝達したい場合、`window.ReactNativeWebView.postMessage`を利用します。

ReactNativeのWebビューからWebサイトにアクセスしたとき、JavaScriptのグローバル変数に`window.ReactNativeWebView.postMessage`が定義されます。

WEBサイト側で以下のようなコードを用意すると、アプリにデータを渡せます。受け付けるデータは`string`だけになっています。

```javascript
if (window.ReactNativeWebView !== undefined) {
	window.ReactNativeWebView.postMessage('Hello')
}
```

`window.ReactNativeWebView.postMessage()`で渡されたデータはWebViewコンポーネントの`onMessage`で受け取れます。`event.nativeEvent.data`にデータが入っています。

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
    const html = `
      <html>
      <head></head>
      <body>
        <script>
          setTimeout(function () {
            window.ReactNativeWebView.postMessage("Hello!")
          }, 2000)
        </script>
      </body>
      </html>
    `;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html }}
          onMessage={(event) => {
            alert(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}
```

### セキュリティ回りの配慮

WebViewの`onMessage`でウェブサイトから実行された`window.ReactNativeWebView.postMessage()`のデータを取得できますが、送信元をチェックしないとセキュリティの脆弱性になりえます。

window.postMessageの説明になりますが、考慮事項、対処方法は参考になるので以下の項目をお読みになることをおすすめします。

`https://developer.mozilla.org/ja/docs/Web/API/Window/postMessage#security_concerns`

`window.ReactNativeWebView.postMessage`の送信元が正規サイトかどうかチェックしましょう。Webビューでページを遷移しているうちに正規サイトから外れてしまう可能性もあるからです。`event.nativeEvent.url`で呼び出し元のURLを取得できます。

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
	// 正規サイトのURL 	  
    const url = 'https://example.com/'
    return (
      <View style={{ flex: 1 }}>
        <WebView
	      source={{ uri: url }}
          onMessage={(event) => {
            const regex = new RegExp(`^${url}`)
			// 正規サイトじゃなければ早期リターン			
			if (!regex.test(event.nativeEvent.url)) return
			alert(event.nativeEvent.data);	
          }}
        />
      </View>
    );
  }
}
```

### WebViewでアクセスできるサイトを制限する

WebViewでページを開いた場合、制限しなければWebサイトのリンクをたどっていくことで他ドメインのページにもアクセスできます。

それは困りますよね。

アクセスできるページを制限したい場合、`originWhitelist`で実現できます。originWhitelistで指定されたWebサイト以外は、iOS, Androidのデフォルトブラウザで開くようになります。

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
	// 正規サイトのURL 	  
    const url = 'https://example.com/'
    return (
      <View style={{ flex: 1 }}>
        <WebView
	      source={{ uri: url }}
      	  originWhitelist={[url]}
        />
      </View>
    );
  }
}
```


## まとめ

以上、React Nativeの`react-native-webview`についてでした。

Webサイトとモバイルアプリでデータがやりとり方法を知っていると、モバイルアプリからWebサイトを開いたときに自動的にログイン処理を行なうことができたりするので、結構便利だと思います。
