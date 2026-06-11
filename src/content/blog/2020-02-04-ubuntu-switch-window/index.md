---
title: "Ubuntu Desktop の Alt + Tab でウィンドウ単位の切り替え[ショートカット]"
subTitle: ""
description: ""
date: 2020-02-04
category: 'it'
tags:
  - Ubuntu
  - Shortcut
cover: ./images/cover.png
---

Ubuntu 18.04 のショートカット Alt + Tab は、アプリケーション単位での切り替えです。

同じアプリケーションで複数ウィンドウを開いていると、アプリケーション単位の切り替えでは切り替えられません。

アプリケーション単位で切り替わるより、ウィンドウ単位で切り替わったほうが嬉しいので、設定を変更します。

## ショートカット Alt + Tab でウィンドウ切り替えに挙動変更

dconf-editor のインストール

```
$ sudo apt install dconf-editor
```

- dconf-editor を開きます
- org/gnome/desktop/wm/keybindings へ移動します
- `switch-applications` から `'<Alt>Tab'` を削除、`'switch-windows'` に '<Alt>Tab' を記述
- `switch-applications-backward` から `'<Shift><Alt>Tab'` を削除、`switch-windows-backward'` に `'<Shift><Alt>Tab'` を記述
- dconf-editor を閉じる
- 設定が反映されていないのなら、X11を再起動



## 参考

https://superuser.com/questions/394376/how-to-prevent-gnome-shells-alttab-from-grouping-windows-from-similar-apps
