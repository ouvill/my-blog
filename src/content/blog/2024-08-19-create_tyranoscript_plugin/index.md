---
title: ティラノスクリプトのプラグイン開発：VOICEVOXプラグインの経験から
date: 2024-08-20
tags:
  - ティラノスクリプト
  - プラグイン
category: 'it'
---

こんにちは！最近、ティラノスクリプトのプラグインをリリースしました。このプラグインは、ティラノスクリプトに表示されるメッセージを逐次VOICEVOXに送信して、音声を合成するものです。

なぜこのプラグインを作ったの？

ティラノスクリプトって、会話劇の動画を作るのに使えるんじゃないかなって思ったんです。そこで、テキストを自動で音声に変換できたら面白いんじゃないかと。

もし興味があれば、プラグインのダウンロードはこちらからどうぞ。

https://ouvill.booth.pm/items/6017687

ソースコードもGitHubで公開しています。

https://github.com/Ouvill/tyrano_voicevox_plugin

さて、今回の記事では、このプラグイン開発を通じて学んだ、ティラノスクリプトのプラグイン開発について解説していきます。

## ティラノスクリプトとは

ティラノスクリプトはHTML、CSS、JavaScriptをベースにしたノベルゲームエンジンです。かつて吉里吉里というノベルツールがあったようで、そのスクリプトの記述方法を受け継いだksファイルを記述することで、ノベルゲームを作成します。

たとえばこんなかんじでシナリオを記述します。

```TyranoScript
#
さて、ゲームが簡単に作れるというから、来てみたものの[p]

誰もいねぇじゃねぇか。[p]
……[p]
帰るか。。。[p]

[font  size="30"   ]
#?
ちょっとまったーーーーー[p]
[resetfont  ]

#
誰だ！？[p]

;キャラクター登場
[chara_show  name="akane"  ]
#?
こんにちは。[p]
私の名前はあかね。[p]
#あかね
もしかして、ノベルゲームの開発に興味があるの？[p]
```

上記のコードで書かれている内容は

- `#`がキャラクター名
- `;`がコメント
- `[p]`がページ送り
- `[chara_show]`がキャラクターの表示

動きの少ない対話劇を作成するだけならばとてもかんたんに作成できます。

## ティラノスクリプトのフォルダ構成

ティラノスクリプトのフォルダ構成は以下のようになっています。

```
.
├── data          // ゲームデータ
│   ├── bgimage   // 背景画像
│   ├── bgm       // BGM
│   ├── fgimage   // 前景画像
│   ├── image     // 他の画像
│   ├── others
│          ├── 3d
│          └── plugin   // プラグイン
│   ├── scenario  // シナリオ
│   ├── sound     // 効果音
│   ├── system    // ゲームコンフィグ
│   └── video     // 動画
├─── tyrano       // ティラノスクリプトの本体データ
│    ├── audio/
│    ├── css/
│    ├── html/
│    ├── images/
│    ├── lang.js
│    ├── libs/
│    ├── libs.js
│    ├── plugins/
│    ├── tyrano.base.js
│    ├── tyrano.css
│    └── tyrano.js
├── index.html
└── readme.txt
```

## プラグインの作成

さて、ここからが本題です。ティラノスクリプトのプラグイン開発、どうやるの？

プラグインを作ることで、ティラノスクリプトの機能を拡張できます。他のプロジェクトに流用しやすくなるのもメリットですね。

今回は`my_plugin`という名前のプラグインを作成してみましょう。

### プラグイン作成の基本手順

プラグインの作成方法は以下の通りです。

1. `data/others/plugin/`にプラグインのフォルダを作成する。(例: `data/others/plugin/my_plugin`)
2. プラグインのフォルダに`init.ks`を作成する。これはプラグインを読み込むときに実行されるファイルです。
3. `init.ks`にプラグインの処理を記述します。

`init.ks`にはプラグインの初期化処理を記述します。

おもにティラノスクリプトで使うマクロを定義したり、`[iscript]`タグを使ってJavaScriptの関数を定義したりします。

```TyranoScript
[macro name="hello_world"]
やあ、こんにちは
[/macro]


[iscript]
window.hello_world = function() {
    alert("Hello, World!");
}
[endscript]

[return]
```

プラグインを利用したい人は、シナリオファイルに以下のように記述します。`first.ks`に記述するのがおすすめです。

```TyranoScript
;プラグイン my_plugin を読み込み
[plugin name="my_plugin" ]

; 
; 任意のシナリオ
; プラグインで定義したマクロを実行
[hello_world]
```

## JavaScriptでガッツリ開発する

ティラノスクリプトの`.ks`ファイルでも結構なことができますが、やはりJavaScriptのほうが圧倒的にできることが多いです。

`.ks`ファイルでもJavaScriptを記述できますが、やはり`.js`ファイルをVSCodeなどのコードエディターで書いたほうが楽です。

### JavaScriptファイルを読み込む

`my_plugin`プラグインの`init.ks`からJavaScript`index.js`を読み込むようにしてみましょう。

`init.ks`に以下のように記述します。

```TyranoScript
[loadjs storage="plugin/my_plugin/index.js" type="module"]
```

おめでとうございます。これで`index.js`が読み込まれます。

`index.js`に本格的にJavaScriptを書いていきましょう。

## JavaScriptからティラノスクリプトのシステムにアクセスする

JavaScriptでガッツリとプラグインを開発する環境が整ったわけですが、どうやってティラノスクリプトのシステムにアクセスするのでしょうか。

ティラノスクリプトのシステムはJavaScriptのグローバル変数`window.TYRANO.kag`に格納されています。ティラノスクリプトでできることは、ほぼ`window.TYRANO.kag`からアクセスできます。

ちなみにJavaScriptの`window`は省略できるので、`window.TYRANO.kag`は`TYRANO.kag`と書くことができます。

### ティラノスクリプトにアクセスする

試しにティラノスタジオから起動したティラノスクリプトのゲーム画面のコンソールで`window.TYRANO.kag`の中身を見てみましょう。

```JavaScript
console.log(TYRANO.kag);
```

出力結果は以下のようになります。

```JavaScript
console.log(TYRANO.kag)
Object { tyrano: {…}, kag: {…}, config: {…}, parser: {…}, ftag: {…}, layer: {…}, menu: {…}, key_mouse: {…}, event_listener_count: 7, event: {…}, … }
​
base: Object { tyrano: {…}, kag: {…} }
​
chara: Object { kag: {…} }

config: Object { defaultStorageExtension: "jpg", projectID: "tyranoproject", game_version: "0.0", … }
​
event: Object { kag: {…} }
​
event_listener_count: 7
​
ftag: Object { kag: {…}, array_tag: (441) […], current_order_index: 19 }
​
kag: Object { tyrano: {…}, kag: {…}, event_listener_count: 7, … }
​
key_mouse: Object { system_key_event: "false", system_mouse_event: "false", is_holding_skip: false, … }
​
layer: Object { kag: {…}, layer_event: {…}, layer_menu: {…}, … }
​
menu: Object { kag: {…} }
​
parser: Object { kag: {…}, flag_script: false, deep_if: 0 }
​
rider: Object { kag: {…} }
​
studio: Object { kag: {…} }
​
tyrano: Object { base: {…}, config: undefined, kag: {…} }
​
<prototype>: Object { version: 520, is_rider: false, is_studio: false, … }
debugger eval code:1:9
```

`chara`とか`ftag`とか`menu`とか色々出てきました。それぞれにティラノスクリプトの機能が格納されています。まあ色々あるんだなぁって感じてもらえればいいです。自分もすべて把握していません。

### ティラノスクリプトの変数にアクセスする

まず基本的な変数にアクセスしてみましょう。

ティラノスクリプトにはいくつかの変数が用意されています。

> - システム変数
> ゲーム全体で共有する変数です。例えば、「エンディングを見たことがあるか否か」といったセーブデータに影響されない内容を保存します。
> - ゲーム変数
> セーブデータ毎に管理する変数です。他のセーブデータが呼び出されると上書きされます。 例えば、「アイテム管理」や「どの選択肢を選んだか」といったゲームの進行に関わるデータを保存します
> - 一時変数
> 一時的に使用するデータを保存します。ゲームを再開しても復元されません。

公式サイトから引用しました。

これらの変数にJavaScriptからアクセスする方法は以下のとおりです。

```JavaScript
window.TYRANO.kag.stat.f       // ゲーム変数
window.TYRANO.kag.variable.sf  // システム変数
window.TYRANO.kag.variable.tf  // 一時変数
```

例えばゲーム変数にデータを保存したい場合は

```JavaScript
// ゲーム変数にデータを保存
window.TYRANO.kag.stat.f.player = {
    name: "Alice",
    hp: 100,
    mp: 50
};
```

これで`player`という変数に`name`、`hp`、`mp`が保存されました。

コンソールに表示させるときは

```JavaScript
console.log(window.TYRANO.kag.stat.f.player);
```

### ティラノスクリプトの関数を呼び出す

ティラノスクリプトには独自のタグがたくさんあります。`[p]`や`[chara_new]`、`[jump]`などなど。これらのタグの機能もJavaScriptから呼びだせます。

ティラノスクリプトのタグをJavaScriptから実行するには以下のように記述します。

```JavaScript
// ティラノスクリプトのタグを実行
window.TYRANO.kag.ftag.startTag("chara_new", {
    name: "yamato",
    storage: "chara/yamato/normal.png",
    jname: "やまと"
});
```

これで`[chara_new]`タグが実行されます。第一引数にタグ名、第二引数にオプションを指定します。

JavaScriptからティラノスクリプトのタグを呼び出せるのは便利ですね。

### ティラノスクリプトのタグをJavaScriptで追加する

ティラノスクリプトはマクロによって独自のタグを追加できます。
どうようのことをJavaScriptからもしたいですよね。

JavaScriptからティラノスクリプトのタグを追加する方法もあります。

ためしに`[hello name="アリス" chan_kun="ちゃん"]`というようなタグを作成してみましょう。これは"name"という引数を受け取り、"やあ, アリスちゃん"という文字列をコンソールに表示するタグとします。

nameは必須の引数で、chan_kunはオプションの引数としましょう。

以下のようになります。

```JavaScript
// ティラノスクリプトのタグを追加
TYRANO.kag.ftag.master_tag["hello_world"] = {
    
    kag: TYRANO.kag,
    // 必須のパラメータを指定
    vital: [
        "name"
    ],
    // オプションパラメータの初期値を指定
    pm: {
        chan_kun: "くん"
    }
    start: function(pm) {
        // 引数を取得
        var name = pm.name;

        console.log("やあ, " + name + pm.chan_kun);

        TYRANO.kag.ftag.nextOrder();
    }
};
```

`TYRANO.kag.ftag.master_tag`にオブジェクトを追加することで、新しいタグを追加できます。

- `kag`はティラノスクリプトのシステム変数を指定します。
- `vital`には必須の引数を指定します。
- `pm`にはオプションの引数のデフォルト値を指定します。デフォルト値は省略できます。今回は`chan_kun`に`くん`を指定しています。`chan_kun`パラメータが指定されなかった場合は`くん`がデフォルトで指定されます。
- `start`にはタグが実行されたときの処理を記述します。引数`pm`にはタグの引数が格納されています。

start関数内で`TYRANO.kag.ftag.nextOrder()`を実行することで、次のタグが実行されます。もし`TYRANO.kag.ftag.nextOrder()`を実行しないと、次のタグが実行されません。ティラノスクリプトの`[s]`タグのように処理が止まってしまうので基本的には`TYRANO.kag.ftag.nextOrder()`を実行するようにしましょう。

これによってティラノスクリプトのタグをJavaScriptから追加することができました。

やったね。

## まとめ

ティラノスクリプトはHTML、CSS、JavaScriptを利用してノベルゲームを作成するためのツールです。プラグインを作成することでティラノスクリプトの機能を拡張することができます。

この記事では

- プラグインの作成方法
- JavaScriptでティラノスクリプトにアクセスする方法
- ティラノスクリプトの変数にアクセスする方法
- ティラノスクリプトのタグを呼び出す方法
- ティラノスクリプトのタグをJavaScriptで追加する方法

について説明しました。ティラノスクリプトの開発の助けになれば幸いです。

## 参考

- [【ティラノスクリプト】オリジナルタグを作ろう ](https://note.com/milkcat/n/n0597d78dd931)
