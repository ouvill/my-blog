---
title: "Gitbook を使って文書を公開する"
subTitle: "作品公開の手間を極力減らす"
description: "Gitbook を導入した話"
date: 2018-11-27 00:00:00
category: "develop"
cover: "thumb.jpg"
---

![cover](cover.jpg)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@alfonsmc10?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Alfons Morales"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Alfons Morales</span></a>

## Gitbook を使って文書を公開する

自作の小説の公開場所として、「小説家になろう」や「カクヨム」は作品公開の場所としては最適です。たくさんの人が日々アクセスしていますし、かなりの読者がいますから。

ですが、ちょっと公開するのが面倒くさい。

たいていの人は原稿を TXT ファイル 、もしくは Word ファイルで書いていると思います。そして原稿を執筆してから、文書全部をカクヨムのサイトにコピー&ペーストして公開する。

推敲もほぼ完了して文書の内容を変更しないのであれば、一度アップロードだけで完了です。ですが、頻繁に書き換える場合、アップロードの手間は少しめんどくさい。

「同じ作業を何度も繰り返すのは極力避けてしまいたい。アップロードを自動化してしまいたい」という欲求があります。

文書は当然 Git で管理していることを前提とすると、Git Push した瞬間、閲覧可能なサイトが生成されるのが大変喜ばしい。

文書作成に特化した Gitbook というツールを使って文書の公開を自動化しましょう。今回は Gitlab-Pages を利用して サイト公開までを自動化します。

## Gitbook とは

gitbook とは markdown で書かれた文書を美しい書籍に変換することが出来るコマンドラインツールです。gitbook を利用することで簡単に目次機能がついたウェブサイトを作成することができます。

* [Gitbook 公式サイト](https://www.gitbook.com)
* [Gitbook 仕様詳細](https://docs.gitbook.com/)

### デモ

どのように表示されるかはサンプルを用意したのでご覧ください

[デモ](https://ouvill.gitlab.io/gitbookexample)

### リポジトリの設定例

Gitlab での設定例を公開しています。

[gitlab](https://gitlab.com/Ouvill/gitbookexample)

## Gitbook に対応したファイル構成

```
root/
  |- README.md : どのような文書かの説明
  |- SUMMARY.md : 目次
  |- .gitignore : git の無視設定
  |~ .gitlab-ci.yml : gitlab-ci の設定ファイル
  |- source/
      |- text1.md : 本文1
      |- text2.md : 本文2
```

`README.md` はどのような文書なのか説明するものにしましょう

``` README.md
# 本文書について
Gitbook の使い方について説明する。
```

`SUMMARY.md` の中身は以下のように書きます。

``` SUMMARY.md
#Summary

* [この文書について](README.md)
* [本文1 タイトル](source/text1.md)
* [本文2 タイトル](source/text2.md)
```

本文テキストは各自でお好きに書いてください。

```
むかしむかしあるところに、おじいさんとおばあさんが……
```

`.gitignore` に不要なファイルを無視する設定を記述しておくとファイル管理が容易になるでしょう

```
/_book/
/node_modules/
/book.pdf
/book.mobi
/book.epub
/public
```

## Gitlab-Pages を利用して Gitbook を公開する

さて、文書を作成したならば、いざファイルを公開していきましょう。

Gitlab に新規リポジトリを開設し、作成した文書を `git push` でアップロードしましょう。

ページの公開方法として Gitlab-Pages を利用します。Gitlab が無料で提供しているホストサービスです。

`.gitlab-ci.yml` という設定ファイルに従って、ウェブサイトを公開できます。

[GitLab Pages examples (英文)](https://gitlab.com/pages/gitbook) : 設定方法についてはここのサイトを参考にしました。

`.gitlab-ci.yml` のファイル設定は次のとおりです。

```
# requiring the environment of NodeJS 10
image: node:10

# add 'node_modules' to cache for speeding up builds
cache:
  paths:
    - node_modules/ # Node modules and dependencies

before_script:
  - npm install gitbook-cli -g # install gitbook
  - gitbook fetch 3.2.3 # fetch final stable version
  - gitbook install # add any requested plugins in book.json

test:
  stage: test
  script:
    - gitbook build . public # build to public path
  only:
    - branches # this job will affect every branch except 'master'
  except:
    - master

# the 'pages' job will deploy and build your site to the 'public' path
pages:
  stage: deploy
  script:
    - gitbook build . public # build to public path
  artifacts:
    paths:
      - public
    # expire_in: 1 week
  only:
    - master # this job will affect only the 'master' branch
```

`.gitlab-ci.yml` が git リポジトリに存在すると自動的に CI ツールがビルドとページの公開を行なってくれます。

公開されたサイトURLは `設定` -> `Pages` から確認できます。


## Netlify を利用して Gitbook を公開する。

Netlify の公式ブログに英語ですが、Gitbook の公開方法が説明されています。

[A Step-by-Step Guide: GitBook on Netlify](https://www.netlify.com/blog/2015/12/08/a-step-by-step-guide-gitbook-on-netlify/)
