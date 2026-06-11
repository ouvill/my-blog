---
title: "FlutterでLinuxアプリをビルドする。"
subTitle: ""
description: ""
date: 2021-06-15
category: 'it'
tags:
  - Flutter
  - Linux
  - Desktop
---

Flutterに興味があります。

今年の3月にiOS, Androidアプリを作成するフレームワークFlutterがバージョン2となりました。
FlutterのサポートがAndroid、iOSだけでなく、Webもサポート対象となり、Flutterを利用できるシーンが増えてきています。さらにWindows,Mac,Linuxのデスクトップアプリもベータサポートとなっています。

私は普段使いのOSがLinuxなので、マルチプラットフォーム対応のプログラミング言語がでてくるのは歓迎です。

今回はFlutterでLinuxアプリを作成できる環境を構築してみます。

行なっていることは公式ドキュメントの[Get the Flutter SDK](https://flutter.dev/docs/get-started/install/linux)と[Build and release a Linux app to the Snap Store](https://flutter.dev/docs/deployment/linux)やっているだけです。

## Flutterの環境構築

flutterのSDKはsnapパッケージとして提供されています。

```
$ sudo snap install flutter --classic
```

ビルドに必要なライブラリをインストールします。

```
$ sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev
```

## FlutterのLinuxデスクトップサポートを有効にする

FlutterのLinuxデスクトップサポートを有効にします。

```
$ flutter config --enable-linux-desktop
```

デバイス一覧にlinuxの項目が追加されます。

```
$ flutter devices 
2 connected devices:

Linux (desktop) • linux  • linux-x64      • Linux
Chrome (web)    • chrome • web-javascript • Google Chrome 91.0.4472.101
```

## Linux対応プロジェクトを作成する

Flutterのプロジェクト作成時、`--platform`を指定することで対象とするプラットフォームを指定できます。

```
$ flutter create --platforms=linux super-cool-app
```

`super-cool-app`はプロジェクト名です。名前はご自由に。同名のディレクトリにFlutterのコードが生成されます


## プロジェクトにLinux対応を追加する

もし既存プロジェクトに開発対象のプラットフォームを追加する場合、既存プロジェクトのディレクトリを指定します。

```
$ flutter create --platforms=linux .
```

※上記はFlutterプロジェクトにいる時のコマンドです。

## 起動する

プロジェクトが作成できたので実行してましょう。

起動時にデバイスのオプションを`linux`と指定するとLinuxアプリケーションとして起動できます。

```
$ flutter run -d linux
```

## ビルドする

ビルド時にプラットフォームを指定することでlinuxデスクトップアプリが作成できます。

```
$ flutter build linux --release
```

ビルドの成果物が`build/linux/x64/release/bundle/`に出力されます。もしソフトウェアを配布する場合、`bundle`フォルダに存在するファイルをすべて含めてください。

## snapでパッケージング

Linuxでソフトウェアの配布形式は`snap`, `deb`, `rpm`, `pacman`, `AppImage`など多岐に渡ります。

FlutterのLinuxサポーターはUbuntuを開発しているCanonicalです。Canonicalが`snap`を開発しているためか、Flutterのパッケージング方法は`snap`が推されています。

よって`snap`形式のパッケージを作成します。

### 必要ソフトのインストール

snapパッケージを作成するために必要なツールをインストールします。

```
$ sudo snap install snapcraft --classic
$ sudo snap install multipass --classic
```

`snapcraft`がパッケージングソフトです。`multipass`はCUIベースの仮想マシン管理ソフトです。

snapcraftはパッケージ作成時に仮想環境を作成します。ビルド環境を隔離することで環境に依存しないパッケージを作成します。そのため仮想マシン管理ソフトの`multipass`が必要になるのです。

### snapcraft.yamlを作成

snapパッケージの設定ファイル`snap/snapcraft.yaml`を作成します。

```
name: super-cool-app
version: 0.1.0
summary: Super Cool App
description: Super Cool App that does everything!

confinement: strict
base: core18
grade: stable

apps:
  super-cool-app:
    command: super_cool_app
    extensions: [flutter-master] # Where "master" defines which Flutter channel to use for the build
    plugs:
    - network

parts:
  super-cool-app:
    source: .
    plugin: flutter
    flutter-target: lib/main.dart # The main entry-point file of the application
```

snapパッケージを作成します。プロジェクトディレクトリで以下のコマンドを実行してください。

```
$ snapcraft
```

snapパッケージの作成にはかなり時間がかかりますのでゆっくり待ちましょう

作成に成功すると`super-cool-app_0.1.0_amd64.snap`パッケージがプロジェクト直下に生成されます。

インストールする場合以下のコマンドでインストールできます。snapstore以外からインストールするので`--dangerous`オプションが必要です。

```
$sudo snap install ./super-cool-app_0.1.0_amd64.snap --dangerous 
```

ビルドが失敗する場合、`build`ディレクトリを削除するなどしてください。

```
$ rm -rf build
$ snapcraft clean
$ snapcraft
```

snapの作成については以下の記事が詳しく書かれています。

[第654回 snapパッケージング入門](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0654?page=1)


## Linuxビルドしてみてわかったこと

Ubuntu 20.04で簡単に開発してみました。

### ウィンドウバーが点滅する

```
$ flutter run -d linux
```

上記コマンドでビルドすることなく実行すると、ウィンドウのメニューバーが点滅したり、表示が消えてしまったりしてしまいました。

```
$ flutter build linux 
```

上記コマンドでビルドしたものはウィンドウのメニューバーに関する問題は確認できませんでした。

開発するときは気になりますが、ビルドしてしまえば問題ありません。

### Snapパッケージの日本語入力の問題

Linuxのデスクトップサーバーの実装としてX11とWaylandがあります。X11は以前から使われておりますが設計が古くなっているので、新実装のWaylandに各ディストリビューションは移行しつつあります。

私の利用しているディストリビューションは`Ubuntu 20.04`です。ログイン時にX11とWaylandを切り替えることができます。使用IMEは`iBus`です。

snapパッケージを作成しインストールすると、X11セッションでは日本語を入力できました。しかしWaylandセッションでは日本語を入力できませんでした。

Flutterの問題というよりもsnapの問題だと思うのですが、現状Wayland環境でsnapアプリの日本語入力は難しそうです。

## まとめ

- FlutterでLinuxアプリケーションを作成できる
- snapパッケージで配布する場合、日本語入力が問題になりそう。

ここまで読んで頂きありがとうございました。
