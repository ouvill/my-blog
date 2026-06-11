---
title: microk8sクラスターのノードを再起動する
date: 2023-01-16
category: 'it'
tags:
  - ubuntu
  - kubernetes
  - microk8s
---

自宅のRaspberry Piはmicrok8sを利用してKubernetesクラスターを構築している。

各ノードを再起動するとき、安全のために一つ一つクラスターから外して再起動するようにしている。以下作業手順のメモ。

## ノードの状態を確認する

```bash
microk8s kubectl get nodes
```

## ノードからコンテナを移動させる

再起動するノードから、稼働しているコンテナを別ノードに移動させる。

```bash
microk8s kubectl drain <node name> --ignore-daemonsets --delete-emptydir-data
```

## ノードをmicrok8sから外す

microk8sクラスターからノードを外す。

再起動予定のノードで実行

```bash
microk8s leave
```

クラスター側で実行

```bash
sudo microk8s remove-node <node name>
```

## ノードを再起動する

```bash
sudo reboot
```

## ノードが再起動したら、ノードをクラスタに追加する

microk8sクラスタで実行

```bash
microk8s add-node
```

## ノードをmicrok8sクラスターに追加する

再起動したノードで実行

```bash
microk8s join <token>
```

## まとめ

microk8sの再起動手順について。

## 参考

- [MicroK8s - Create a MicroK8s cluster](https://microk8s.io/docs/clustering)
