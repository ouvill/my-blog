---
title: FirefoxでファイルダイアログにDolphinを利用する
date: 2025-08-19
tags:
    - Firefox
category: 'it'
---

## 問題

私は現在(2025-08-19)普段遣いのOSとしてKubuntu 25.04を、デフォルトのブラウザとしてFirefoxを利用しています。

しかし、Firefoxでファイルをダウンロードしたりしたときに表示されるファイルブラウザはKDEのデフォルトのファイルブラウザであるDolphinではなく、GNOMEのデフォルトのファイルブラウザであるNautilusが表示されてしまうという問題が発生していました。

## 解決策

`xdg-desktop-portal`と`xdg-desktop-portal-kde`が確実にインストールされていることを確認してください。

```bash
apt list --installed xdg-desktop-portal xdg-desktop-portal-kde
```

インストールされていなければ以下のコマンドでインストール

```bash
sudo apt install xdg-desktop-portal xdg-desktop-portal-kde
```

firefoxを開き、アドレスバーに`about:config`と入力して設定画面を開きます。

`widget.use-xdg-desktop-portal.file-picker`を検索し、値を`1`に設定し保存します。

これで、FirefoxがDolphinを使用するようになります。

## 参考

https://discuss.kde.org/t/make-firefox-use-dolphin-file-dialog/15105
