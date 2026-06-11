---
title: Gitのインストール解説
date: 2024-09-06
tags:
    - Git
category: 'it'
---

WindowsのGitのインストール、難しくないですか？

インストーラーで聞かれることが多すぎて、何を選択すればいいのかわからなくなりがちだと思います。

インストール方法、設定方法を解説します。

## Gitのダウンロード

Gitのページにアクセスします。Download for Windowsをクリックします。

![alt text](images/Screenshot_win11_2024-09-06_02:20:04.png)

ダウンロードページに移動するので、`Click here to download manually`をクリックします。

![alt text](images/Screenshot_win11_2024-09-06_02:23:41.png)

## Gitのインストール

ダウンロードフォルダにダウンロードされたインストーラーをダブルクリックして実行します。

インストーラーを起動すると以下の画面が表示されます。

ライセンス表示です。ライセンスを読んで同意するかどうかを選択します。

![alt text](images/cropped_vlcsnap-2024-09-05-22h19m53s342.png)

どこにインストールするのかを選択します。基本的にデフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m00s026.png)

スタートメニューのショートカットを作成するかどうかを選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m06s172.png)

Gitで利用するエディタを選択します。デフォルトの設定のままではVimが選択されています。Vimはキーバインドが特殊で慣れていないと使いにくいです。Visual Studio Codeを選択するのがおすすめです。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m24s413.png)

Visual Studio Codeを選択してインストールを進めます。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m36s623.png)

Gitのデフォルトのブランチの名前を選択します。Gitのデフォルトブランチは`master`が採用されていました。しかし、`master`は差別的な言葉であるとして、`main`に変更する動きが広がっています。`main`を選択するのがおすすめです。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m50s728.png)

mainに変更してインストールを進めます。

![alt text](images/cropped_vlcsnap-2024-09-05-22h20m56s564.png)

Gitを環境変数のPATHに追加するかを選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h22m14s510.png)

Gitは通信にOpenSSHを利用します。Gitに同梱されているOpenSSHを利用するか、システムのOpenSSHを利用するかを選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h22m32s857.png)

Gitは通信にSSL/TLSをを利用します。Gitに同梱されているOpenSSLを利用するか、Windowsのものを利用するかを選択します。デフォルトのままで問題ありません。

ただし、企業管理のパソコンの場合は、Windows Secure Channelを選択したほうが楽でしょう。

![alt text](images/cropped_vlcsnap-2024-09-05-22h22m42s416.png)

改行コードを自動で変換するかを選択します。歴史的にWindowsの改行コードはCRLF、Linux, Macの改行コードはLFでした。

ソフトウェア開発では改行コードをLFに統一することが多いです。デフォルトの設定ではGitに変更を記録するときはLFで保存して、WindowsでチェックアウトするときはCRLFに変換するようになっています。

WindowsでもLFの改行コードが扱えるようになっているので、チェックアウトするときにCRLFに変換するのは不要になっています。個人的には真ん中の`Checkout as-is, commit as-is`を選択するのがおすすめです。

![alt text](images/cropped_vlcsnap-2024-09-05-22h22m56s930.png)

Gitの端末エミュレーターを選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h23m34s590.png)

`git pull`の挙動を選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h23m41s067.png)

Git Credential Helperを選択します。デフォルトのままで問題ありません。`https`のリポジトリにアクセスする時、ユーザー名とパスワードを入力する必要があるのですが、これによってユーザー名とパスワードを端末に保存し入力を省略します。

![alt text](images/cropped_vlcsnap-2024-09-05-22h23m47s066.png)

追加のオプションを選択します。デフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h23m55s344.png)

実験的機能の有効化を選択します。最新の機能を試したい、Gitの開発に貢献したい場合のみ有効化しましょう。基本はチェックを入れずデフォルトのままで問題ありません。

![alt text](images/cropped_vlcsnap-2024-09-05-22h24m01s558.png)

以上でインストールが完了しました。おつかれさまでした。

![alt text](images/cropped_vlcsnap-2024-09-05-22h24m10s803.png)
