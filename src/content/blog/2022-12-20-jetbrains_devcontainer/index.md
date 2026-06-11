---
title: 'JetBrains GatewayでローカルのdevContainerを利用する'
subTitle: ''
description: ''
cover: ''
date: 2022-12-20
tags: []
---

こんにちは、おーびるです。

Visual Studio CodeのdevContainerを利用していますか？　開発環境を丸々Dockerコンテナとして作成して、ローカルの開発環境を汚さずに開発できるので、とても便利です。

開発環境を隔離できるVSCodeのDevContainerを利用するのが好きです。しかしVisual Studio Codeも便利ですが、やはりJetbrains社のIDEを各種使いたいと思ってしまいます。

いろいろと試行錯誤した結果、以下のコードを`devcontainer.json`に追記するようにしています。

```json
{
  "features": {    "ghcr.io/devcontainers/features/sshd:1": {},
    "ghcr.io/ouvill/devcontainers_features/authorized_keys:0": {
      "github_account": "ouvill" // githubのアカウント名
    },
  },
  "forwardPorts": [
    2222
  ],
  "mounts": [
    "source=jetbrains,target=/jetbrains,type=volume"
  ]
}
```

以下、どうしてこのような構成になったのか、解説記事になります。

なお、本記事はWSL, Linux, Macでの動作を前提としています。ネイティブWindowsから利用する場合、若干修正が必要となることをご了承ください。

## 前提知識:

### devContainer 

Dockerで作った開発環境。VSCodeは`.devcontainer.json`や`.devcontainer/devcontainer.json`と書かれたファイルを発見すると、開発コンテナをビルドし、`Remote Development`の拡張機能によってコンテナの中でVSCodeを動かせる。

 ### JetBrains Gateway: 

JetBrains社が開発しているリモート開発ソフト。SSH接続を利用して、サーバーにJetBrains社のIDEを動かし、描画だけローカルで行う。

## JetBrains GatewayでdevContainerを利用する

二つの方法があります。

- GitHub CodeSpace を利用する
- ローカルのDevContainerにSSHサーバーを建てて、JetBrains Gatewayで利用する

## 方法1: GitHub CodeSpace を利用する

GitHub CodeSpaceがdevContainerに対応しています。CodeSpace上に開発環境を構築し、JetBrains GatewayでSSH接続すれば快適な開発環境が構築できます。

デメリットは無料枠を使い切ってしまうとコストがかかることです。JetBrains GatewayをCodeSpaceで利用する場合、4コア以上の環境が推奨されていますので無料枠は30時間ほどで使い切るでしょう。

ssh で接続さえできたらいいので、以下のような`.devcontainer.json`を作成するだけでOKです。

```json
{
	"name": "Ubuntu",
	"image": "mcr.microsoft.com/devcontainers/base:jammy"
	"features": {
        "ghcr.io/devcontainers/features/sshd:1": {},
    },
	"forwardPorts": [2222],
}
```

## 方法2: ローカルのDevContainerにSSHサーバーを建てて、JetBrains Gatewayで利用する

ローカルにdevContainerにSSHサーバーを建てて、JetBrains Gatewayを利用する方法です。

`.devcontainer.json`は以下のようにします。

```json
{
	"name": "Ubuntu",
	"image": "mcr.microsoft.com/devcontainers/base:jammy"
	"features": {
        "ghcr.io/devcontainers/features/sshd:1": {},
    },
	"forwardPorts": [2222],
}
```

これをプロジェクトルートに配置し、[Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)をインストールしたVSCodeでdevContainerを起動した後、`localhost:2222`にJetBrains GatewayでSSH接続します。

ただこれにはいくつか問題があります。

- いちいちVSCodeを起動しなければならない
- ssh接続するとき、パスワードを設定しなければならない
- JetBrains Gatewayで接続するとき、IDEの本体2GB～3GBほどがダウンロードされる

これらの問題を解決していきましょう。

### いちいちVSCodeを起動しなければならない

VSCodeからdevContainerの機能だけ切り出した、[Dev Container CLI](https://github.com/devcontainers/cli)を利用しましょう。

```bash
npm install -g @devcontainers/cli
```

ただ触ってみた感じ、使い勝手がやや悪かったです。

VSCodeでコンテナ起動するほうが簡単だったので、私は利用していません。

### SSH接続するとき、パスワードを設定しなければならない。

devContainerを初回起動時、SSHのパスワードを設定する必要があります。

```bash
sudo passwd $(whoami)
```

コンテナをビルドするたびにパスワードを設定するのは面倒です。公開鍵認証で接続するように設定します。

紹介する方法は二つです。

- SSHキーを`.ssh/authorized_keys`にマウントする
- GitHubの公開鍵を`.ssh/authorized_keys`にコピーする

#### SSHキーを`.ssh/authorized_keys`にマウントする

devContainerに接続するためのSSHキーを作成します。

```bash
ssh-keygen -t rsa -b 4096 -C "jetbrains@devcontainer" -f ~/.ssh/jetbrains
```

生成した公開鍵をdevContainerの`/home/vscode/.ssh/authorized_keys`にマウントするように`.devcontainer.json`を設定します。

```json
{
    "name": "Ubuntu",
	"image": "mcr.microsoft.com/devcontainers/base:jammy"
    "features": {
        "ghcr.io/devcontainers/features/sshd:1": {},
        // 追記
        "ghcr.io/ouvill/devcontainers_features/authorized_keys:latest": {}
    },
    "forwardPorts": [
        2222
    ],
    "mounts": [
        // 追記
        "source=${localEnv:HOME}${localEnv:USERPROFILE}/.ssh/jetbrains.pub,target=/home/vscode/.ssh/authorized_keys,type=bind,consistency=cached,readonly"
    ]
}
```

自作の`ghcr.io/ouvill/devcontainers_features/authorized_keys`を追加していますが、これはコンテナをビルド時にコンテナ内に`.ssh`フォルダを作成します。`.ssh`フォルダがない状態で`.ssh/authorized_keys`へマウントしてしまうと`.ssh`フォルダがroot権限で作成されてしまいエラーになってしまうのを回避します。

#### GitHubの公開鍵を`.ssh/authorized_keys`にコピーする

"https://github.com/ユーザー名.keys" にアクセスするとGitHubの公開鍵を取得できます。

自作の`ghcr.io/ouvill/devcontainers_features/authorized_keys`は、オプションに`github_account`が設定されると、指定されたアカウントの公開鍵を`.ssh/authorized_keys`にコピーするようにしています。

```json
{
    "name": "Ubuntu",
    "image": "mcr.microsoft.com/devcontainers/base:jammy"
    "features": {
        "ghcr.io/devcontainers/features/sshd:1": {},
        "ghcr.io/ouvill/devcontainers_features/authorized_keys:0": {
            // 追記
            "github_account": "ouvill" // githubのアカウント名
        }
    },
    "forwardPorts": [
        2222
    ],
    "mounts": [
        "target=/home/vscode/.ssh/authorized_keys,type=bind,consistency=cached,readonly"
    ]
}
```

これで、SSH接続時にパスワードを入力する必要がなくなりました。

### JetBrains Gatewayで接続するとき、IDEの本体2GB～3GBほどがダウンロードされる

IDE本体はコンテナに直接保存せず、`docker volume`を作成し、そちらに保存するように設定しましょう。各種コンテナに共通の`docker volume`をマウントするようにすれば、IDEをコンテナごとにダウンロードしなくなり、起動も早くなり、使用するファイル容量も少なくなります。

まず、`docker volume`を作成します。

```bash
docker volume create jetbrains
```

`jetbrains`volumeをdevContainerにマウントするように`.devcontainer.json`を追記しましょう。JetBrains GatewayはIDEを`$USER/.cache/JetBrains/RemoteDev/dist`に保存します。

```json
{
    "name": "Ubuntu",
	"image": "mcr.microsoft.com/devcontainers/base:jammy"
    "features": {
        "ghcr.io/devcontainers/features/sshd:1": {},
    },
    "forwardPorts": [
        2222
    ],
    "mounts": [
        // 追記
        "source=jetbrains,target=/jetbrains",
    ]
}
```

以上でJetBrainsのIDEを快適に起動させる準備が整いました。

あとはJetBrains Gatewayで`localhost:2222`に接続するだけです。

- ユーザー名:`vscode`
- 認証タイプ:キーペア
- 秘密鍵ファイル: 
    - WSLの場合: \\wsl$\\Ubuntu\\home\\\<user\>\.ssh\jetbrains
    - Linux,Macの場合: ~/.ssh/jetbrains
- 厳密なホストチェック:しない

で接続してください。

IDE選択時、インストールオプションから「インストールパスのカスタマイズ」、「/jetbrains」を指定してください。

## まとめ

JetBrainsのIDEを保存するために、dockerボリュームを用意

```bash
docker volume create jetbrains
```

`.devcontainer.json`に以下を追記する

```json
{
  "features": {
    "ghcr.io/devcontainers/features/sshd:1": {},
    "ghcr.io/ouvill/devcontainers_features/authorized_keys:0": {
      "github_account": "ouvill" // githubのアカウント名
    },
  },
  "forwardPorts": [
    2222
  ],
  "mounts": [
    "source=jetbrains,target=/jetbrains,type=volume"
  ]
}
```
