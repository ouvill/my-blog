---
title: "PHP のお勉強"
subTitle: ""
description: ""
date: 2020-01-06
category: 'it'
tags:
  - PHP
cover: ./images/cover.png
---

## PHP のお勉強

PHP のお勉強

## PHP コード

php のコードは `<?php ?>`で囲まれた中に記述します。

```php
<?php
// phpコードを記述する
?>
```

## 変数

PHP の変数は `$` をつける。大文字と小文字で区別される

```php
<?php
$name="Ouvill"
echo $name
?>
```

出力例

```
Ouvill
```

## 文字列を表示する

`echo` で文字を表示できる

```php
<?php
    echo "Hello PHP!!<br/>";
    echo "10 + 7<br/>";
    echo 10 + 7;
?>
```

表示例

```
Hello PHP
10 + 7
17
```

`""(ダブルクオーテーション)`や`''（シングルクオーテーションマーク）`で囲まれたものは文字列になる

### "" と '' の違い

`""` で囲まれた文字列は変数展開ができる。`''`では変数展開されない。

```php
<?php
    $hello = "Hello World"
    echo "変数展開される ${hello}"
    echo '変数展開されない ${hello}'
?>
```

出力例

```
変数展開される Hello World
変数展開されない ${hello}
```

## 文字列の連結

PHPでは、連結用の演算子`.`がある。
`.` を利用することで文字列の連結ができる。

```php
<?php
    $php = "PHP"
    echo "Hello".$php
?>
```

出力例

```
HelloPHP
```

## if 文、条件分岐

他言語と同様に if 文がある

```php
<?php
if ( 条件式 ) {
    // true のとき
} else { 
    // false のとき
}
?>
```

## for文

他言語と同様に for 文がある

```php
<?php
for (初期値式; 条件式; 増減式) {
    //ループ内容
}
?>
```

例,1 ~ 100 までを出力する

```php
for ($i = 1; $i <= 100; $i++) {
    echo $i."<br>"

````

## foreach 文

`foreach ( 配列 as $key )` で要素に順番にアクセスできる。

```php
<?php
$fruits = array("りんご","みかん","バナナ")
foreach ($fruits as $fruit) {
    echo $fruit
}
?>
```

連想配列の場合も利用できる.

```php
<?php
  $a = array("Apple" => "りんご", "Orange" => "みかん", 
             "Grape" => "ぶどう");
      foreach( $a as $key => $value) {
      print("$key は、$value<br>\n");
     }
?>
```
