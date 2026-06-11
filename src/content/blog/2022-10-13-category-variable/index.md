---
title: "データ解析 カテゴリ変数"
subTitle: ""
description: ""
cover: './category-variable-cover.png'
date: 2022-10-13
category: 'it'
---

機械学習でデータを突っ込むとき、「男」「女」や職業の「営業」「プログラマー」「作家」「投資家」「事務」などのデータはそのまま突っ込むことができない。

カテゴリを表すので、カテゴリ変数と呼ばれる。

そのままだと学習に問題があるのでデータの下処理を行なう。

## カテゴリ変数の手法

### One hot Encoding （ワンホットエンコーディング）

ダミー変数と呼ばれる。カテゴリに含まれているかどうかを0,1で表す。カテゴリ数が多いと次元の爆発が起こるので、カテゴリ数が多い場合は他の手法を使う。

| 職業 |
|------|
| 営業 |
| 事務 |
| プログラマー |
| 作家 |
| 投資家 |

| 営業 | 事務 | プログラマー | 作家 |
|---|---|---|---|
|  1    | 0 | 0 | 0 |
|  0    | 1 | 0 | 0 |
|  0    | 0 | 1 | 0 |
|  0    | 0 | 0 | 1 |

### Label Encoding （ラベルエンコーディング）

カテゴリを数値に変換する。

| 職業 | ラベル |
|------| ------ |
| 営業 | 0 |
| 事務 | 1 |
| プログラマー | 2 |
| 作家 | 3 |
| 投資家 | 4 |

n個のカテゴリがある場合、n-1個のラベルを割り当てる。数字に意味がないので、One hot Encodingの方が良い。しかしながら、ラベルエンコーディングの方がメモリを節約できる。カテゴリが多い場合はラベルエンコーディングを使う。次元の呪いを回避するために、ラベルエンコーディングを使う。向かない学習モデルはロジスティック回帰や決定木の分岐など。

## Pythonでの実装

### One hot Encoding

pandasのget_dummiesを使う。

```python
import pandas as pd

df = pd.DataFrame({
    '個人番号': [1, 2, 3, 4, 5],
    '職業': ['営業', '事務', 'プログラマー', '作家', '投資家']
})

df = pd.get_dummies(df, columns=['職業'])
print(df)
```

出力

```bash
    個人番号  職業_事務  職業_作家  職業_営業  職業_プログラマー  職業_投資家
0        1        0        0        1                 0          0
1        2        1        0        0                 0          0
2        3        0        0        0                 1          0
3        4        0        1        0                 0          0
4        5        0        0        0                 0          1
```

sklearnのOneHotEncoderを使う。

```python
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

df = pd.DataFrame({
    '個人番号': [1, 2, 3, 4, 5],
    '職業': ['営業', '事務', 'プログラマー', '作家', '投資家']
})

enc = OneHotEncoder(handle_unknown='ignore', sparse=False)
df_one_hot = pd.DataFrame(enc.fit_transform(df[['職業']]))
df_one_hot.columns = enc.get_feature_names(['職業'])
df = pd.concat([df, df_one_hot], axis=1)
df = df.drop('職業', axis=1)
print(df)
```

出力

```bash
    個人番号  職業_事務  職業_作家  職業_営業  職業_プログラマー  職業_投資家
0        1        0        0        1                 0          0
1        2        1        0        0                 0          0
2        3        0        0        0                 1          0
3        4        0        1        0                 0          0
4        5        0        0        0                 0          1
```

### Label Encoding

sklearnのLabelEncoderを使う。

```python
import pandas as pd
from sklearn.preprocessing import LabelEncoder

df = pd.DataFrame({
    '個人番号': [1, 2, 3, 4, 5],
    '職業': ['営業', '事務', 'プログラマー', '作家', '投資家']
})

le = LabelEncoder()
df['職業'] = le.fit_transform(df['職業'])
print(df)
```

## まとめ

カテゴリ変数を扱うときは、One hot EncodingやLabel Encodingを使い、数値に変換する。
