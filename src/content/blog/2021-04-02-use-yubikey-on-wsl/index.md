---
title: "WSL2でYubikeyを利用する。"
subTitle: ""
description: ""
date: 2021-04-02
category: 'it'
tags:
  - Yubikey
  - WSL
  - SSH
  - GPG
cover: ./images/cover.png
---

## 動機

私はGPGが好きです。GPGキーを1つ持っているだけで、パスワードやファイルの暗号化に、gitのコミット署名、SSHの認証キーとして利用できるからです。

私はYubikeyが好きです。U2Fのセキュリティキーとしても利用できますし、GPGキーの格納デバイスとしても利用できるからです。

YubikeyでGPGキーを管理すると、複数のマシンでGPGキーを保存しておく必要がなくなり、鍵管理が楽になります。

普段はUbuntu Desktopで作業していますが、WSLもこなれてきたのでWindowsで開発もありだなぁっと思えるようになりました。

なのでWSLでYubikeyを使いたい。

ということでやってみた。

## 前提

YubikeyにはすでにGPGキーの設定がされているものとします。

やり方はこれが一番詳しい

[drduh/YubiKey-Guide](https://github.com/drduh/YubiKey-Guide)

## 方法

### Windows側での操作

#### [gpg4win](https://www.gpg4win.org/)をインストール

gpgを利用できるように、[gpg4win](https://www.gpg4win.org/)をインストールしてください。

#### [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)のインストール

SSHクライアントの[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)をインストールしてください。（もしかしたらいらないかも？）

#### `gpg-agent.conf`の設定

`gpg-agent`の設定ファイル`gpg-agent.conf`を編集します
Windows 10の初期設定だと、`C:\Users\%USERNAME%\AppData\Roaming\gnupg\gpg-agent.conf`にあります。

下記を追加してください

```
enable-putty-support
```

#### `gpg-connect-agent /bye`の自動起動設定

パソコンを起動したときに`gpg-agent`を自動起動するように設定します。

自分は`gpg-agent.vbs`というファイルを作成して、スタートアップに登録しています。

##### 方法

- `Win + R`に`shell:startup`を入力してスタートアップフォルダを開く
- `gpg-agnet.vbs`というファイルに以下を記述。画面表示をしないように設定しています。

```
Set objWShell = CreateObject("Wscript.Shell") 
objWShell.run "gpg-connect-agent /bye", vbHide 
```

以上でWindows側の設定は終了です。

### WSL(Linux)側での操作

WSL側の設定を行います。WSLのシェルのなかで作業してください。

今回、WSL側からgpg-agnetを利用するために、[wsl2-ssh-pagent](https://github.com/BlackReloaded/wsl2-ssh-pageant)を使います。

wsl2-ssl-pagent は、`socat`と`ss`を必要とします。必要に応じて各ディストリビューションの方法でインストールしてください。Ubuntuの場合、以下のコマンドでインストールできます。

```
sudo apt-get install socat iproute
```

`wsl2-ssl-pagent`をダウンロードし、実行権限を付与します。

```
$ wget -O "$HOME/.ssh/wsl2-ssh-pageant.exe" https://github.com/BlackReloaded/wsl2-ssh-pageant/releases/latest/download/wsl2-ssh-pageant.exe
$ chmod +x "$HOME/.ssh/wsl2-ssh-pageant.exe"
```

`~/.bashrc`に以下を記載します。

```
## SSHの設定
export SSH_AUTH_SOCK=$HOME/.ssh/agent.sock
ss -a | grep -q $SSH_AUTH_SOCK
if [ $? -ne 0 ]; then
        rm -f $SSH_AUTH_SOCK
        (setsid nohup socat UNIX-LISTEN:$SSH_AUTH_SOCK,fork EXEC:$HOME/.ssh/wsl2-ssh-pageant.exe >/dev/null 2>&1 &)
fi

## GPGの設定
export GPG_AGENT_SOCK=$HOME/.gnupg/S.gpg-agent
ss -a | grep -q $GPG_AGENT_SOCK
if [ $? -ne 0 ]; then
        rm -rf $GPG_AGENT_SOCK
        (setsid nohup socat UNIX-LISTEN:$GPG_AGENT_SOCK,fork EXEC:"$HOME/.ssh/wsl2-ssh-pageant.exe --gpg S.gpg-agent" >/dev/null 2>&1 &)
fi
```

## 再起動

変更内容を適用するためにパソコンの再起動、または`gpg-agent`の再起動と`WSL`の再起動を行ってください。

### gpg-agentの再起動

Windows側で

```
gpg-connect-agent.exe killagent /bye
gpg-connect-agent.exe /bye
```

### WSLインスタンスの再起動

Windows側

WSLのディストリビューション名を調べる。

```
wsl -l -v
```

出力

```
  NAME            STATE           VERSION
* Ubuntu-20.04    Running         2
```

WSLのディストリビューションを終了する

```
wsl -t Ubuntu-20.04
```

終了した後、WSLを起動する

## 動作確認

WSLからYubikeyが認識しているか

```
~$ gpg --card-status
Reader ...........: Yubico YubiKey OTP FIDO CCID 0
Application ID ...: *****************************************
Application type .: OpenPGP
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: ********
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......:
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa4096 rsa4096 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: **** **** **** **** ****  **** **** **** **** ****
      created ....: 1970-01-01 00:00:00
Encryption key....: **** **** **** **** ****  **** **** **** **** ****
      created ....: 1970-01-01 00:00:00
Authentication key: **** **** **** **** ****  **** **** **** **** ****
      created ....: 1970-01-01 00:00:00
General key info..: [none]
```

WSLからYubikeyを利用してSSHが利用できるか

```
$ ssh -t git@github.com
Hi Ouvill! You've successfully authenticated, but GitHub does not provide shell access.
```

動作しているのを確認できたら完了。お疲れ様でした。

## 参考

[BlackReloaded/wsl2-ssh-pageant](https://github.com/BlackReloaded/wsl2-ssh-pageant)
[WSLでYubikeyを使う](https://ama.ne.jp/post/yubikey-on-wsl/#on-wsl-2)
[[Windows] バッチファイル（.bat）を非表示・最小化した状態で起動する](https://uguisu.skr.jp/Windows/bat_nowindow.html)
[SSH authentication using a YubiKey on Windows](https://developers.yubico.com/PGP/SSH_authentication/Windows.html)
[(PCではなく)WSL2のみを終了、再起動する方法](https://astherier.com/blog/2020/08/how-to-terminate-wsl2/)
