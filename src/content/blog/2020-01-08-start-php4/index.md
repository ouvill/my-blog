---
title: "PHP のお勉強4"
subTitle: ""
description: ""
date: 2020-01-08
category: 'it'
tags:
  - PHP
cover: ./images/cover.png
---

PHP のお勉強。ほとんどメモ書きのようなもの。

## クラスプロパティ

インスタンスではなく、クラスがもつデータをクラスプロパティという。
`static` をつけることでクラスプロパティになる。

呼び出すときは`クラス名::プロパティ名` となる。`::`でクラス名とプロパティ名をつなぐ。

```php 
<?php
class Sample {
    public static $count = 3;
}

echo Sample::$count
?>
```

クラス内で自身のプロパティにアクセスする際は、`self`を利用する

```php 5
<?php
    class Sample {
       public static $count = 0;
       public function __construct() {
           self::$count++;
       }
    }
    
?>
```

## クラスメソッド

インスタンスではなく、クラスがもつデータをクラスメソッドという。
`static` をつけることでクラスメソッドになる。

`クラス名::クラスメソッド名` で呼び出す。

```
<?php
    class Sample {
        public static $count = 0;
        public static function getCount(){
            return self::$count
        }
    }
    
    Sample::getCount();
?>
```

## 継承

クラスの継承もできる。

```
<?php
class クラス名 extends 継承元 {
    
}
?>
```

## instanceof

特定のクラスのインスタンスか判別するには `instanceof` が使える。

```php
<?php
$coffee = new Drink()
if ($coffee instanceof Drink) {
    
}

?>
```

## オーバーライド

継承した親クラスに定義されたメソッドと同名のメソッドを定義すると、メソッドを上書きできる。

親クラスのメソッドを呼びたい時は `parent::` を利用する。

```php
<?php

class Parent {
    pubclic function __construct() {
        
    }
}

class Sample extends Parent {
    public function __construct() {
        // コンストラクタのオーバーライド
        // 親のコンストラクタを呼ぶ
        parent::__construct();
    }
}
?>

```
