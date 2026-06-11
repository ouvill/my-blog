---
title: "Kubernetes のお勉強"
subTitle: ""
description: ""
date: 2020-01-07
category: 'it'
tags:
  - インフラ
  - コンテナ
cover: ./images/cover.png
---

## kubenetes の環境構築

ubuntu が使えるなら、snap パッケージを利用するのが楽。

### kubectl のインストール

```
sudo snap install kubectl --classic
```

### 開発用に Kubernetes のクラスターを用意

ubuntu 環境を利用しているので microk8s を利用する。

https://microk8s.io/

```
sudo snap install microk8s --classic
sudo microk8s.status --wait-ready
sudo microk8s.enable dns dashboard registry
```

`kubectl` でアクセスできるように、microk8s の Config を `~/.kube/config` に書き出す。`~/.kube/config` はKubernetes の認証情報やクラスター情報を格納している。

```
microk8s.config > $HOME/.kube/config
```

## Kubernetes のダッシュボードにアクセスする

token を取得する

```bash
$ token=$(sudo microk8s.kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)
$ sudo microk8s.kubectl -n kube-system describe secret $token
```

ダッシュボードにアクセスするためのアドレスを取得する。

```
$ kubectl get services --namespace=kube-system
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                  AGE
dashboard-metrics-scraper   ClusterIP   10.152.183.163   <none>        8000/TCP                 13d
heapster                    ClusterIP   10.152.183.143   <none>        80/TCP                   13d
kube-dns                    ClusterIP   10.152.183.10    <none>        53/UDP,53/TCP,9153/TCP   13d
kubernetes-dashboard        ClusterIP   10.152.183.142   <none>        443/TCP                  13d
monitoring-grafana          ClusterIP   10.152.183.219   <none>        80/TCP                   13d
monitoring-influxdb         ClusterIP   10.152.183.75    <none>        8083/TCP,8086/TCP        13d
```

今回の場合、ダッシュボードをアクセスするには、`https://10.152.183.142/` にアクセスすればよいと分かる。

ただし、ClusterIP なので、ローカルアドレスからしかアクセスできない点に注意。

ダッシュボードにアクセスできたら、取得した Token を利用して認証する。

### 外部から Kubernetes のダッシュボードにアクセスする場合

ダッシュボードをポートフォワーディングでアクセスできるようにする。

```
microk8s.kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443 --address 0.0.0.0
```

上記のようにすると、ローカルマシンの10443ポートとダッシュボードが結びつく。

なので、ローカルマシンから `https://127.0.0.1:10443` にアクセスしたり、外部マシンから`https://${microk8sを動かしたPCのIP}:10443` でアクセスできる。

## Kubernetes でコンテナ作成

リソースファイルを作成

sample-pod.yml（nginx を立ち上げるだけの簡単なもの）

```yml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
spec:
  containers:
    - name: nginx-container
      image: nginx:1.13
```

リソースファイルを元にコンテナを立ち上げる。

```
kubectl create -f sample-pod.yml
```

リソースファイルを変更した場合、起動中のPODに変更内容を適用する場合、`kubectl apply`を利用する

```
kubectl apply -f sample-pod.yml
```

もし、`kubectl apply` を行ったときに、クラスター内にリソースが存在しない場合、`kubectl create` を行ったときのように、リソースを作成してくれる。

なので、基本的にリソースを立ち上げる場合、`kubectl apply` を利用すればよい。

## Kuberntetes でコンテナ削除

`kubectl delete` を利用する。

```
kubectl delete -f sample-pod.yml
```

## まとめ

以上、Kubernates のインストールから、簡単なリソースの立ち上げまででした。

## 参考

- [第560回　microk8sでお手軽Kubernetes環境構築](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0560)
- [Dashboard addon](https://microk8s.io/docs/addon-dashboard)
