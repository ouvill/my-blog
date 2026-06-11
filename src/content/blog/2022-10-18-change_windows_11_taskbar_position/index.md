---
title: "Windows 11のタスクバー位置を変更する"
subTitle: ""
description: ""
cover: './cover.png'
date: 2022-10-18
category: 'it'
---

Windows 10のときにタスクバー位置を変更していると、Windows 11へアップグレードしたときにタスクバー位置が画面下に配置されていない場合がある。とくにタスクバーが画面左や画面右に配置されてしまうと、アイコンが表示されず全然使い物にならない。

私はマルチウィンドウのディスプレイの1つのタスクバーが左に配置されてしまっていて困ったので修正する。

## Windowsのタスクバー位置を変更する。

- レジストリエディターを開く。

## シングルディスプレイの場合、

- `Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3` を開く。
- `Settings` を開く。
- 上から二行目、左から五列目を `03` に変更すると、タスクバーを下に変更できる。

## マルチディスプレイの場合

- `Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\MMStuckRects3` を開く
- ディスプレイの名前が書かれているので、変更したいディスプレイの設定を開く。（わからない場合、すべての設定を書き換える）
- 上から二行目、左から五列目を `03` に変更すると、タスクバーを下に変更できる。

## 備考

数字を変更することで、画面のタスクバーの位置を決定できる。数字の示す位置は以下の通り

- 00: 左
- 01: 上
- 02: 右
- 03: 下

## 参考

https://www.ubackup.com/windows-11/change-taskbar-location-windows-11.html
