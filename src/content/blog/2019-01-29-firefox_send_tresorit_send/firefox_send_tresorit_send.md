---
title: "Firefox Send と Tresorit Send - 暗号化ファイル送信サービス"
subTitle: "「宅ふぁいる便」に代わるファイル転送サービス"
description: "今回は「宅ふぁいる便」に代わるファイル転送サービスについて紹介しようと思います。"
date: 2019-01-29 20:00:08
category: 'it'
tags:
  - security
  - crypto
---

Firefox Send と Tresorit Send は大容量のファイルを安全に相手に送信したいときに便利なサービスです。送信するファイルは暗号化されるため、安全に使えます。

<!-- more -->

## 宅ふぁいる便で情報流出事件

メールに添付するには大きすぎる大容量のファイルをやりとりするときに便利なファイル転送サービス「宅ふぁいる便」。メールアドレスやパスワードが流出する問題が発生しており、現在サービスが停止している状況です。

[「宅ふぁいる便」不正アクセスで480万件のユーザー情報流出　メアド・パスワードも](http://www.itmedia.co.jp/news/articles/1901/26/news015.html)

おそらく利用していた人もそこそこいたのではないですか。サービスが停止してしまい、困っている人もいるとおもいます。

今回は「宅ふぁいる便」に代わるファイル転送サービスについて紹介しようと思います。

紹介するのは、以下の二つのサービスです。

* [Firefox Send](https://send.firefox.com)
* [Tresorit Send](https://send.tresorit.com) 

## Firefox Send

Web ブラウザー「Firefox 」の開発元である Mozilla が提供しているファイル転送サービス「[Firefox Send](https://send.firefox.com)」をオススメしたいです。

![](./images/firefox_send.png)

最大1GBまでのデータを送ることができます。

オススメしたい理由はセキュリティに配慮されている点です。

特徴的な機能は以下のようなもの

* 1GB までアップロードできる
* 一度ダウンロードされたらファイルが削除される（設定により20回まで増やせる）
* 24時間後にファイルは削除される
* アップロードする前に暗号化が施され、サービス提供者の Mozilla ですらどのようなファイルがアップロードされているのか知ることができない。
* ファイルをドラッグ&ドロップするだけでアップロードできる。
* パスワードを設定可
* ユーザー登録は不要
* インターフェースは日本語に対応

ファイル共有に使える容量が 1GB と少ないのですが、かなりセキュリティに配慮されており、使い勝手のよいサービスです。

[Firefox Send](https://send.firefox.com)

## Tresorit Send

[Tresorit Send](https://send.tresorit.com) もおすすめのファイル共有サービスです。[Tresorit](https://tresorit.com/about-us/team) というDropboxのようなオンラインストレージサービスを提供している会社が運営しています。

![](./images/tresorit_send.jpg)

利用料金は無料で、最大 5GB までのデータを送ることができます。

オススメしたい理由は、こちらもセキュリティに配慮されている点です。

機能は以下のようなもの

* 転送容量は 5GB まで
* 複数ファイルを同時にアップロードできる
* 10回ダウンロード または 7日経過で自動的にファイルは削除
* ダウンロードされたときは通知がメールアドレスにくる設定が可能
* ファイルは自動的に暗号化。サービス提供者でも中身をみることができない。
* パスワードを設定可
* ドラッグ&ドロップだけでアップロードできる

ユーザーインターフェースが英語なので、とっつきにくいかもしれませんがかなり便利なサービスです。ダウンロードされると、メールで通知を送ってもらうこともできるので、相手に確認する手間も省けます。

[Tresorit Send](https://send.tresorit.com)

## まとめ

二つのファイル転送サービスを紹介しました。どちらのサービスもアップロード前に暗号化が施されるため、サービス運営者に中身を見られることもなく安全にファイルを送信することができます。ファイル転送サービスを利用する場合、選択肢の一つとしてご検討ください。

![](./cabinet.jpg)

Photo by [Jan Laugesen](https://unsplash.com/photos/4UbSaPKGRqc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/cabinet?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
