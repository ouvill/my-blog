---
title: "Ubuntu 19.04をインストール"
subTitle: "Ubuntu 19.04 をインストール"
description: ""
date: 2019-06-06
category: 'it'
tags:
    - linux
    - ubuntu
    - app
cover: "./images/Disco-Dingo.jpg"
---

## Ubuntu 19.04 インストール

Ubuntu 19.04 をインストールしました。

インストール手順は、たぶんネットにゴロゴロと転がっていると思うので省略。

ただ注意するところとしては、UEFI でブートしている場合、EFIモードでインストールメディアを起動すること。レガシーブートでインストールしてしまうと、インストールしたのち、起動ディスクが見つからないとなって起動しません。

## インストール後に行った設定

### ソフトウェアアップデート

ネット（有線）につなげて、ソフトウェアアップデート

```
sudo apt update && sudo apt upgrade -y
```

### 必要なソフトのインストール

#### エディタ関連

##### VS Code

公式サイトからインストーラーダウンロード

#### ブラウザ

この辺

##### Brave

プライバシーを重視したWEBブラウザ

公式サイトの手順にしたがってインストール

##### Vivaldi

タブを並べて表示できたりする多機能ブラウザ

公式サイトからインストーラーダウンロード

##### Chrome

開発用ブラウザ

公式サイトからインストーラーダウンロード

#### 開発環境

基本、snap 版をインストールします。

##### git

バージョン管理

`sudo apt install git`

##### curl

コマンドラインの HTTP クライアント

`sudo apt install curl`

##### node

`sudo snap install node --channel=10/stable --classic`

##### docker

コンテナ管理。

```
sudo addgroup --system docker
sudo adduser $USER docker
newgrp docker
sudo snap install docker
```

##### gitkraken 

Git GUI クライアント

`sudo snap install gitkraken`

##### kvm 

仮想PC。Android エミュレーターの高速化のため

( Cosmic (18.10) 以降 ) `sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils`

#### ファイル関連

##### Tresorit

 暗号化対応のオンラインストレージ

##### keybase

GPG 鍵基盤。暗号化Gitリポジトリを利用できる。

##### Smart Card Daemon

GPG のスマートカードをインストール

`sudo apt install scdaemon pcscd`

## 軽く触ってみた所管

軽く触った感じではこれまでの Ubuntu と変化は感じませんでした。内部的には大きく変わっているのかもしれませんけど……

微妙に困ったのがソフトウェア切り替えのショートカットキーが「Alt + Tab」ではなく、「Super + Tab」になっていました。

## まとめ

Ubutnu 19.04 をインストールして、追加でインストールしたアプリのメモでした。
