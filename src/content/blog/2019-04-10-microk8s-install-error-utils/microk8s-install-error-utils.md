---
category: develop
tags:
  - k8s
  - microk8s
  - snap
  - linux
date: 2019-04-11
title: Ubuntu 18.04 で microk8s が utils.sh 関連のエラーでインストールできないときの対処
vssue-title: microk8s-install-error-utils
description: "Ubuntu 18.04 で microk8s が utils.sh 関連のエラーでインストールできないときの対処"
---

k8s が最近流行っているし、ちょっと勉強がてら、お手軽開発環境の microk8s でもインストールしようとしたら、なんだかインストール時にエラーが発生。

```bash
$sudo snap install microk8s --classic # エラー発生
```

## 解決策

edge 版をインストールする。

```bash
$sudo snap install microk8s --edge --classic
```

## 解説……ほどでもないけど

表示されたエラーメッセージは以下のようなもの。

```bash
$sudo snap install microk8s --classic 
error: cannot perform the following tasks:
- Run install hook of "microk8s" snap if present (run hook "install": 
-----
+ export LD_LIBRARY_PATH=/snap/microk8s/492/lib:/snap/microk8s/492/usr/lib:/snap/microk8s/492/lib/x86_64-linux-gnu:/snap/microk8s/492/usr/lib/x86_64-linux-gnu
+ LD_LIBRARY_PATH=/snap/microk8s/492/lib:/snap/microk8s/492/usr/lib:/snap/microk8s/492/lib/x86_64-linux-gnu:/snap/microk8s/492/usr/lib/x86_64-linux-gnu
+ export PATH=/snap/microk8s/492/usr/sbin:/snap/microk8s/492/usr/bin:/snap/microk8s/492/sbin:/snap/microk8s/492/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/bin:/usr/local/bin
+ PATH=/snap/microk8s/492/usr/sbin:/snap/microk8s/492/usr/bin:/snap/microk8s/492/sbin:/snap/microk8s/492/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/bin:/usr/local/bin
+ source /snap/microk8s/492/actions/common/utils.sh
+ cp -r /snap/microk8s/492/default-args /var/snap/microk8s/492/args
+ mkdir /var/snap/microk8s/492/certs
+ openssl genrsa -out /var/snap/microk8s/492/certs/serviceaccount.key 2048
Generating RSA private key, 2048 bit long modulus (2 primes)
.............................................................+++++
.........................................................................+++++
e is 65537 (0x010001)
+ openssl genrsa -out /var/snap/microk8s/492/certs/ca.key 2048
Generating RSA private key, 2048 bit long modulus (2 primes)
...................+++++
........................................................................+++++
e is 65537 (0x010001)
+ openssl req -x509 -new -nodes -key /var/snap/microk8s/492/certs/ca.key -subj /CN=127.0.0.1 -days 10000 -out /var/snap/microk8s/492/certs/ca.crt
Can't load ./.rnd into RNG
139678506800192:error:2406F079:random number generator:RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=./.rnd
+ openssl genrsa -out /var/snap/microk8s/492/certs/server.key 2048
Generating RSA private key, 2048 bit long modulus (2 primes)
.......+++++
.................+++++
e is 65537 (0x010001)
++ get_default_ip
+++ /snap/microk8s/492/bin/netstat -rn
+++ /snap/microk8s/492/bin/grep '^0.0.0.0'
+++ /snap/microk8s/492/usr/bin/gawk '{print $NF}'
+++ head -1
++ local DEFAULT_INTERFACE=enp4s0
+++ /snap/microk8s/492/sbin/ifconfig enp4s0
+++ /snap/microk8s/492/bin/grep 'inet '
+++ /snap/microk8s/492/bin/sed -e s/addr://
+++ /snap/microk8s/492/usr/bin/gawk '{print $2}'
++ local IP_ADDR=
++ echo
+ IP_ADDR=
+ produce_server_cert
/snap/microk8s/492/actions/common/utils.sh: 行 108: $1: 未割り当ての変数です
-----)
```

Github のほうを覗いてみると、しっかりとエラーとして Issue が立てられていた。

該当する [Issue "Install error with utils.sh"](https://github.com/ubuntu/microk8s/issues/402)

どうやら Ubuntu 18.04 の特定環境下で発生するエラーのよう。

チケットが切られたのが記事執筆時点で 9 日前。
そして修正がコミットされたのが、その翌日（はえー）

安定版にはまだ修正内容が取り入れていないが、edge 版には修正がすでに取り込まれた。
 edge 版をインストール。

```bash
$sudo snap install microk8s --edge --classic
microk8s (edge) v1.14.1 from Canonical✓ installed
```

無事インストールされた。

しばらく待っていると安定版にも修正が取り込まれるだろう。だいたい各月の28日前後に安定版がリリースされているもよう。

## まとめ

microk8s がインストールできないときは、開発版をインストールしてみる。
