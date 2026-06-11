---
title: "npm install sharpで失敗するときの対処"
subTitle: ""
description: ""
date: 2019-06-14
category: 'it'
tags:
    - linux
    - javascript
    - node
---

最近 GatsbyJS を利用して開発しているのですが、当方の環境（ubuntu 19.04) では `yarn install` を行うとインストールがコケます。

なんでコケるんだろうと思いつつも、そんなときは node docker コンテナを立ち上げて、そちらで`yarn start` や `yarn install` を行っていました。

ただやっぱりローカルで実行できる環境も構築しておきたかったので、対策を施しました。


## 状況説明

今回、エラーを発生させる npm ライブラリは `sharp` というものです。

`yarn add sharp` を行うとエラーが発生し、ライブラリがインストールできない。

gatsbyjs では `sharp` のライブラリが利用されているため開発が不便。

実際に表示されるエラーはこちら。

```bash
error /home/user/workspace/gatsby/blog/node_modules/sharp: Command failed.
Exit code: 1
Command: (node install/libvips && node install/dll-copy && prebuild-install) || (node-gyp rebuild && node install/dll-copy)
Arguments: 
Directory: /home/user/workspace/gatsby/blog/node_modules/sharp
Output:
info sharp Using cached /home/user/.npm/_libvips/libvips-8.7.4-linux-x64.tar.gz
ERR! sharp Please delete /home/user/.npm/_libvips/libvips-8.7.4-linux-x64.tar.gz as it is not a valid tarball
ERR! sharp zlib: unexpected end of file
info sharp Attempting to build from source via node-gyp but this may fail due to the above error
info sharp Please see https://sharp.pixelplumbing.com/page/install for required dependencies
gyp info it worked if it ends with ok
gyp info using node-gyp@3.8.0
gyp info using node@10.16.0 | linux | x64
gyp info spawn /usr/bin/python2
gyp info spawn args [ '/usr/lib/node_modules/npm/node_modules/node-gyp/gyp/gyp_main.py',
gyp info spawn args   'binding.gyp',
gyp info spawn args   '-f',
gyp info spawn args   'make',
gyp info spawn args   '-I',
gyp info spawn args   '/home/user/workspace/gatsby/blog/node_modules/sharp/build/config.gypi',
gyp info spawn args   '-I',
gyp info spawn args   '/usr/lib/node_modules/npm/node_modules/node-gyp/addon.gypi',
gyp info spawn args   '-I',
gyp info spawn args   '/home/user/.node-gyp/10.16.0/include/node/common.gypi',
gyp info spawn args   '-Dlibrary=shared_library',
gyp info spawn args   '-Dvisibility=default',
gyp info spawn args   '-Dnode_root_dir=/home/user/.node-gyp/10.16.0',
gyp info spawn args   '-Dnode_gyp_dir=/usr/lib/node_modules/npm/node_modules/node-gyp',
gyp info spawn args   '-Dnode_lib_file=/home/user/.node-gyp/10.16.0/<(target_arch)/node.lib',
gyp info spawn args   '-Dmodule_root_dir=/home/user/workspace/gatsby/blog/node_modules/sharp',
gyp info spawn args   '-Dnode_engine=v8',
gyp info spawn args   '--depth=.',
gyp info spawn args   '--no-parallel',
gyp info spawn args   '--generator-output',
gyp info spawn args   'build',
gyp info spawn args   '-Goutput_dir=.' ]
gyp info spawn make
gyp info spawn args [ 'BUILDTYPE=Release', '-C', 'build' ]
make: ディレクトリ '/home/user/workspace/gatsby/blog/node_modules/sharp/build'　に入ります
  TOUCH Release/obj.target/libvips-cpp.stamp
  CXX(target) Release/obj.target/sharp/src/common.o
../src/common.cc:25:10: fatal error: vips/vips8: そのようなファイルやディレクトリはありません
 #include <vips/vips8>
          ^~~~~~~~~~~~
compilation terminated.
make: *** [sharp.target.mk:128: Release/obj.target/sharp/src/common.o] エラー 1
make: ディレクトリ '/home/user/workspace/gatsby/blog/node_modules/sharp/build' から出ます
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/usr/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:262:23)
gyp ERR! stack     at ChildProcess.emit (events.js:198:13)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
gyp ERR! System Linux 5.0.0-16-generic
gyp ERR! command "/usr/bin/node" "/usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /home/user/workspace/gatsby/blog/node_modules/sharp
```
エラーメッセージを見ると、vips/vips8 というライブラリが足りていないようです。そのため追加でインストールします。

```
sudo apt install libvips-dev 
```

なんだか 100MB のデータを取得して、300MB のディスク領域を消費するって言われました。でっかいなぁ、って思いながらインストール。

インストールが終わったら、sharp のインストールに再度チャレンジ

```
yarn add sharp
```

問題なくインストールが進み、実行できるようになりました。

## まとめ

`yarn install` でコケるのが結構困っていたので解決できてよかったです。

ちなみに docker のなかにある node は vips がすでに含まれているようでこの問題は発生しません。
