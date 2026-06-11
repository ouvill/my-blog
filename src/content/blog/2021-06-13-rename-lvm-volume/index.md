---
title: "LVMでボリュームをリネームする"
subTitle: ""
description: ""
date: 2021-06-13
category: 'it'
tags:
  - LVM
  - Linux
  - FS
---

普段私はUbuntu Desktopで作業しています。

パーティションはLVMで管理しています。

かなり前に論理ボリュームを`LogVol01`, `LogVol02`という名前で作成してしまいました。`LogVol01`は`/`に、`LogVol02`は`/home`にマウントしています。
`lvdisplay`などで論理ボリュームを確認したときに、どの用途で使われているのか判別が難しいので名前を変更することにしました。

以下、備忘録です。

lvmで作成した論理ボリュームは以下のコマンドで名前が変更できる。

```
sudo lvrename VG LV LV_new
```

今回の場合、`LogVol01`は`root_lv`, `LogVol02`は`home_lv`とリネームしたいので以下のようにコマンドを入力する

```
$sudo lvrename VolGroup01 LogVol01 root_lv
$sudo lvrename VolGroup01 LogVol02 home_lv
```

変更できたか確認
 
```
$sudo lvs
```

## 自動マウントの確認

自動マウントの設定`fstab`の設定も正しく設定されているか確認する。
`/etc/fstab`にUUIDでマウントするように設定しておけば、lvmの名前が変更になっても問題なくマウントできるはず。

```
$sudo blkid /dev/mapper/VolGroup01-home_lv
/dev/mapper/VolGroup01-home_lv: UUID="xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx" TYPE="ext4"
```

もしUUIDだけを取得したい場合は

```
sudo blkid /dev/mapper/VolGroup01-home_lv -s UUID -o value
```


UUIDを取得したので、fstabにマウント設定が記述されているか確認する

```
cat /etc/fstab | grep $(sudo blkid /dev/mapper/VolGroup01-home_lv -s UUID -o value)
UUID=3b53b566-6c91-4bed-8137-4ef4096f29ca /home           ext4    defaults        0       2
```

もし`root`パーティションや`boot`パーティションを変更した場合、grubを更新する。

```
sudo update-grub
```

※自分は`update-grub`を忘れていたために、Linuxが起動しなくなり、liveUSBで`grub`を再インストールすることになった。

以上
