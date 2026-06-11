---
title: "PHP のお勉強2"
subTitle: ""
description: ""
date: 2020-01-07
category: 'it'
tags:
  - PHP
cover: ./images/cover.png
---
PHP 入門2

PHP のお勉強 その2

クラス編

## クラス

PHP でもクラスが使える。

```
<?php
    class Sample() {
        
    }
    
    $ins = new Sample()
?>
```

## プロパティ

プロパティには`インスタンス変数->メンバ変数`でアクセスできる。

```
<?php
    class Sample() {
        public $str;
    }
    $ins = new Sample()
    $ins->str = "Hello"
    echo $ins->str
?>
```

実行例

```
Hello
```

## メソッド

クラスメソッドを定義できる

```php
<?php
    class Sample() {
        public function hello() {
            echo "hello world";
        }
    }
    
    $ins = new Sample();
    Sample->hello();
?>
```

実行例

```
hello world
```

## アクセス修飾子

`public` はインスタンス外からアクセスできる。
`private` はクラス内でしかアクセスできない。
`protected` クラス内、及び子クラスからしかアクセスできない。

## $this

クラス内で自身のプロパティやメソッドにアクセスするには、`$this`が利用できる。

```
<?php
    class Sample() {
        public $str = "world"
        
        public function hello() {
            echo "hello".$this->str
        }
    }
?>
```

## コンストラクタ

インスタンス生成時実行するメソッド、コンストラクタを定義できる

```php
<?php
    class Sample() {
        public function __constract() {
            echo "インスタンスを生成しました。"
        }
    }
    
    $ins = new Sample()
?>
```

コンストラクタに引数をあたえると、インスタンス生成時に引数を利用できる。

```php
<?php
    class Sample() {
        public $name;
        public function __constract($name) {
            $this->name = $name;
        }
    }
    
    $ins = new Sample("Ouvill")
    echo $ins->name
?>
```

実行例

```
Ouvill
```

## まとめ

PHP のクラスについて。
基本的に他言語と同じように使える。
