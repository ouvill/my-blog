---
title: "Window のターミナルの色を簡単に変更する（ WLS にも適応）"
subTitle: "cmd.exe の色を変更して見やすい環境を構築しよう"
description: "cmd.exe の色を変更して見やすい環境を構築しよう"
date: 2019-01-11 20:00:08
category: 'it'
cover: "thumb.jpg"
---

Windows の コマンドラインって色が大変見にくいです。[^1]

[^1]: コマンドラインの色は Windows 10 Fall Creators Update で[変更](http://www.itmedia.co.jp/news/articles/1708/03/news050.html)されています。しかし、それが適応されるのは Windows 10を新規インストールした人のみです。

Windows の `cmd.exe` の色を変更する場合、`cmd.exe` の プロパティを開き、ぽちぽち一色ずつ文字を変更する必要があります。

正直言ってかなり面倒くさい。

幸いなことに Microsoft が cmd.exe の色テーマを変更するツールをリリースしてくれています。

- [Microsoft/console (リリースページ)](https://github.com/Microsoft/console/releases)
- [Microsoft/console (Github リポジトリ)](https://github.com/Microsoft/console)

簡単に色テーマを変更できて、かなり便利でした。

## 使い方

1. Github から `ColorTool.zip` ファイルを保存する
2. `ColorTool.zip` を解凍する
3. `cmd.exe` を開き、解凍したフォルダに移動する
4. コマンドを入力する

```
> Colortool.exe -b ${色テーマ}
```

solarized_dark を適用する場合、

```
> Colortool.exe -b solarized_dark
```

### 色テーマについて

適応できる色テーマを確認する場合、以下のコマンドを入力してください。

```
> Colortool.exe -s
```

![適応できる色テーマ一覧](https://res.cloudinary.com/ouvill/image/upload/v1547193773/IT/cmd_color_tool_schemes.png)

私は OneHalfDark を設定しました。



### その他オプション

その他指定できるオプションを確認したい場合、ヘルプを表示してください

```
> Colortool.exe --help
```

## 参考

* ~~[WSL上のUbuntuのターミナル色テーマを変更する](https://www.write-ahead-log.net/entry/2018/02/10/231137)~~ リンク切れ
* [Microsoft、Windowsコンソールのカラースキームを20年で初めて変更へ](http://www.itmedia.co.jp/news/articles/1708/03/news050.html)

![](./code.jpg)

Photo by [Markus Spiske](https://unsplash.com/photos/4T5MTKMrjZg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/command?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
