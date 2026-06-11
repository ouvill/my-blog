---
title: "Raspberry Pi 3台で利用してKubernetesクラスターを作成した。"
subTitle: ""
description: ""
cover: ''
date: 2022-05-11
category: 'it'
tags:
  - 
---

Raspberry Pi 3台で利用してKubernetesクラスターを作成した。

半導体不足の中、幸運なことにRaspberry Piの8GBモデルを三台入手しました。せっかくなのでRaspberry Pi を利用してKubernetesクラスターを作成しました。

利用するKubernetes構築ツールはCanonial社がメンテナンスしているmicrok8sです。

最初はRaspberry PiのOSをUbuntu 22.04にして設定していましたが、どうやら仮想ネットワークを作成する機能にバグがあるのかクラスター間通信が上手くいっていないようなので、Ubuntu 20.04で構築し直しました。

以下のページを参考に行ないました。

https://ubuntu.com/tutorials/how-to-kubernetes-cluster-on-raspberry-pi#1-overview

簡単に手順を記載します。

### microk8sのインストール

microk8s のインストール。これは構築したいコンピュータすべてで実行します。

```
sudo snap install microk8s --classic
```

### microk8sクラスターの構築

microk8s のクラスターを構築します。任意の一台で以下のコマンドを実行。

```
microk8s add-node
```

以下のような表示がでます。

```
From the node you wish to join to this cluster, run the following:
microk8s join 192.168.1.****:25000/**********8b4c313f2c4afce7d117/e38*******
```

端末の表示の指示通りクラスターに参加させたいコンピュータで上記コマンドをコピーして実行します。

上記手順をクラスターに参加させたい台数分繰り返します。

microk8sは一台でマスターノード、ワーカーノードを兼業します。もし三台で構築した場合、マスターノード3台、ワーカーノード3台構成となります。

## まとめ

microk8sクラスターを構築しました。一台のパソコンが落ちてしまっても落ちないKubernetesクラスターで信頼性が向上しました。

ただ自宅のネットワークが落ちてしまったり、ブレーカーが落ちてしまったときは、クラスターも死ぬので、プロダクション用途では利用できないでしょう。

ただ一台構成よりも信頼性は上がってるので、何かと自宅クラスターとして役に立ってくれるはずです。