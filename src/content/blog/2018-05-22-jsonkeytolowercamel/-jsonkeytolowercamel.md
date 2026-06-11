---
title: "スネークケースで登録されたJSONオブジェクトのキーをキャメルケースに変換する"
subTitle: "統一したい"
date: 2018-05-22 00:00:00
category: "develop"
tag: 
    - javascript
    - json
    - camelcase
---
こんにちは、今回はスネークケースで登録されたJSONオブジェクトのキーをキャメルケースに変換する方法についてです。

まずはソースコードをペタリと

```javascript
const snakeToLowerCamel = (text) => {
return text.replace(/[-_](.)/g, (match, group1) => group1.toUpperCase())
}

const jsonKeyToLowerCamel = (obj) => {
if (!typeof (obj) === 'object' || typeof (obj) === 'string' || typeof (obj) === 'number' || typeof (obj) === 'boolean') {
return obj;
}

if (obj instanceof Array) {
for (let i in obj) {
obj[i] = jsonKeyToLowerCamel(obj[i]);
}
return obj
}

let keys = Object.keys(obj);
let lowKey = ""
for (let i in keys) {
lowKey = snakeToLowerCamel(keys[i]);
if (lowKey == keys[i]) {
obj[lowKey] = jsonKeyToLowerCamel(obj[keys[i]]);
continue
} else {
obj[lowKey] = jsonKeyToLowerCamel(obj[keys[i]]);
delete obj[keys[i]]
}
}
return obj
}
```

## 解説
`snakeToLowerCamel` はキャメルケースをスネークケースに変換する関数です。
`jsonKeyToLowerCamel` はJSONオブジェクトを再帰的に変換する関数です。

## なぜこんなものを作ったか

現在開発中のサービスのデータベースにPostgresql を使っているのですが、カラムの命名規則をスネークキャメルと定めました。
そしてJavascriptの命名規則はキャメルケースにすると定めました。
するとDBとJavascript間でデータをやり取りするときに、命名規則の違いで混乱するということが起こってしまいました。「じゃあデータをやり取りするときに変換処理を施せばいいじゃないか」と作成したのが上記の関数です。

## 注意点
上記関数は再帰関数を使っており処理的には少し重いですし、JSONキーの命名規則をスネークケースからキャメルケースにするという処理しか行いません。なのでプログラム上は全くもってメイン処理に寄与しません。ただ命名規則が統一されてJavascriptでデータを扱うときにすっきりするというだけです。

利用する場面をよく考えて利用していただければと思います。
