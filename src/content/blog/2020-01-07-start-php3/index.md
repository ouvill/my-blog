---
title: "PHP のお勉強3"
subTitle: ""
description: ""
date: 2020-01-07
category: 'it'
tags:
  - PHP
cover: ./images/cover.png
---
PHP 入門3

PHP のお勉強 3

## HTML と PHP の混在

PHP は分散して記述することができる。定義部分、利用部分をわけられる。
一箇所に記述する必要はない。

```php
<?php
    $data = "hello world"
?>

<h3><?php echo $data ?></h3>
```

実行例

```
<h3>hello world</h3>
```

## endforeach, endif,endfor

foreach, if, for 文は`{}`で囲まず、`:`で区切って終了箇所に`<?php endforeach ?>`となどと書くことができる

例 foreach

```
<?php foreach(配列 as $key): ?>
    <p>$key</p>
<?php endforeach?>
```

例 if

```php
<?php if ($age > 20): ?>
    <p>あなたは成人です。</p>
<?php endif?>
```

例 for

```php

<?php for ($i = 0; $i < 100; i++): ?>
    <p><?php echo $i?></p>
<?php endfor?>
```

## ファイル分割

`require_once("ファイルパス")` で別ファイルを読み込むことができる。
表示とクラス定義を分割できる。

class.php

```php
class Sample() {
// クラス定義
}
```

main.php

```php
require_once("class.php");
$ins = new Sample();
```
