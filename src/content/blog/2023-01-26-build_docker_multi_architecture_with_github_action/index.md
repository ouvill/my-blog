---
title: GitHub_ActionでARM64とAMD64のDockerイメージをビルドする
tags:
  - docker
  - github_actions
date: 2023-01-26T08:07:24.511Z
category: 'it'
---


我々が普段利用しているパソコンにはCPUが搭載されており、そのCPUはx86_64(AMD64)というアーキテクチャを持っている。しかし、Raspberry PiなどのARMベースのマイコンにはARM64というアーキテクチャを持っている。ARM64とx86_64は互換性がないため、x86_64のDockerイメージをARM64のマシンで動かすことはできない。

現在のパソコンはx86アーキテクチャが主流だが、MacのCPU M1、M2がARM64アーキテクチャを採用したり、Oracle Cloudの無料インスタンスでARM64のインスタンスが提供されたりとARMアーキテクチャが普及してきている。

サーバー開発では盛んにDockerコンテナが利用されるようになっている。これらDockerコンテナがARM64のマシンで動かせるように、DockerイメージをARM64とx86_64の両方のアーキテクチャでビルドしておくと便利である。

Gitでmainブランチが更新されるたびに自動的にDockerイメージをビルドするように設定するとさらに便利である。

GitHub ActionsでARM64とAMD64のDockerイメージをビルドする方法を調べた。

## 結論

ghcr.ioにDockerイメージをpushする場合、以下のファイルを`.github/workflows/ghcr.yml`に配置する。

```yaml
name: ghcr Docker

# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

on:
  schedule:
    - cron: '19 6 * * *'
  push:
    branches: [ "main" ]
    # Publish semver tags as releases.
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  # Use docker.io for Docker Hub if empty
  REGISTRY: ghcr.io
  # github.repository as <account>/<repo>
  IMAGE_NAME: ${{ github.repository }}


jobs:
  build:

    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      # This is used to complete the identity challenge
      # with sigstore/fulcio when running outside of PRs.
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      # https://github.com/docker/setup-qemu-action
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      # Workaround: https://github.com/docker/build-push-action/issues/461
      - name: Setup Docker buildx
        uses: docker/setup-buildx-action@79abd3f86f79a9d68a23c75a09a9a85889262adf

      # Login against a Docker registry except on PR
      # https://github.com/docker/login-action
      - name: Log into registry ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@28218f9b04b4f3f62068d7b6ce6ca5b26e35336c
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Extract metadata (tags, labels) for Docker
      # https://github.com/docker/metadata-action
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      # Build and push Docker image with Buildx (don't push on PR)
      # https://github.com/docker/build-push-action
      - name: Build and push Docker image
        id: build-and-push
        uses: docker/build-push-action@ac9327eae2b366085ac7f6a2d02df8aa8ead720a
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64
```

## コード解説

重要なのは`docker/setup-buildx-action`のコードより上に`docker/setup-qemu-action@v2`を追加し、`docker/build-push-action`のオプションに`platforms: linux/amd64,linux/arm64`を追加することである。

ひな形となるコードはGitHubのリポジトリ-> Actions -> New workflowから`Publish Docker Container`を選択すると自動生成される。

## Docker Hubにイメージをpushする場合

Docker Hubにイメージをプッシュする場合は、Docker Hubであらかじめリポジトリを作成しておき、Account Settings -> Security -> New Access Tokenからアクセストークンを作成する。

作成したアクセストークンをGitHubのリポジトリ-> Settings -> Secrets -> New repository secretに登録する。名前はお好みで`DOCKERHUB_TOKEN`などとする。

`ghcr.yml`の`docker/login-action`の`username`と`password`を以下のように変更する。

```yaml
      - name: Log into registry ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@28218f9b04b4f3f62068d7b6ce6ca5b26e35336c
        with:
          username: username # Docker Hubのユーザー名
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```

また、コンテナイメージの名前を`ghcr.io`から`docker.io`に変更する。

```yaml
env:
  # Use docker.io for Docker Hub if empty
  REGISTRY: docker.io
  # github.repository as <account>/<repo>
  IMAGE_NAME: ${{ github.repository }}
```

ほかのDockerレジストリにイメージをプッシュする場合は、`docker.io`を適宜変更する。

## 参考

- [Multi-arch build and images, the simple way | Docker](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/)
- [GitHub - docker/setup-qemu-action: GitHub Action to configure QEMU support](https://github.com/docker/setup-qemu-action)
