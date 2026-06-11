---
title: "CDN を使ってサイトの高速化した話"
subTitle: "やっぱりサイト表示は早くないと"
description: "CDN を使ってサイトを高速化。"
date: 2018-11-28 00:00:00
category: "develop"
cover: "thumb.jpg"
---

![](cover.jpg)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@cadop?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Mathew Schwartz"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Mathew Schwartz</span></a>

※ 解説記事でないです。

[メインブログ](https://ouvill.net) のほうを CloudFlare というCDNを使って高速表示するように設定してきました。

サイトの表示はやっぱり早く表示できるようにしておきたいですから。

早くなったかどうかはいまいちわかりません。体感早くなったかなと感じるかな。

今度解説記事を書こうかなとも思うのですが、ネットを検索すれば、とても詳しく解説してくれているサイトも見つかるので、あまり書く気がおきない。他の人に任せて私は小説を書こう。そうしよう。

## ちょこっとだけ解説

けど、わざわざブログをみてくださっている人に申し訳ないので、少しだけでも実用的な内容を書きましょう。

### CDNとは 【 Content Delivery Network 】

ウェブサイトのコピーを世界中に配置されたサーバーに予め配信しておき、ページ要求が来たときは一番近くのサーバーが応答するように設定されているネットワーク。

コンテンツ配信に特化しているため応答速度がとても早い。さらに本家サーバーの間に中間サーバーが挟まるようになるため DDOS 攻撃にも強くなる。

### CloudFlare とは

CDN サービスを提供している会社。高機能なのに無料プランもある。個人利用であれば十分。おそらくアクセスが増えれば、有料プランに移行する必要があるのだが、当分そんなことはなさそう。

## こちらのサイトについて

現在こちらのサイトは [GatsbyJS](https://www.gatsbyjs.org) というツールを使ってサイトを作成しているのですが、初回のレンダリングがやや遅い。一度ページをロードしてしまえば、ページ遷移自体は早いのですけど、どうも初回は遅い。

なんとかしないとなぁーと考えているところです。

遅くないですかね？

~~コメントで教えていただけると嬉しいです。~~

諸事情によりコメントシステムは無効化されました。

あと、iPhone のブラウザだと何だか挙動が怪しい気もするので、それも少し不安なところ。

ただサイトの設定を色々変えようと思ったらかなり時間がかかるので、ちょっと手出しするのが億劫でもあります。

ウェブサイト作成もやるべき所がかなり多くあり、大変ですね。

というか、Markdown で書きたいという欲求から当ブログを解説したのですが、予想以上にサイト構築に労力が割かれてしまっていて少し困った状況です。
