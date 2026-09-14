# Ouvill のブログ

[blog.ouvill.net](https://blog.ouvill.net) — IT 技術ブログ

Astro ベースの静的サイトです。

## 開発

```bash
npm run dev        # 開発サーバー起動 (http://localhost:4321)
npm run build      # プロダクションビルド
npm run preview    # ビルド結果のプレビュー
npm run typecheck  # 型チェック
```

型チェックでは、`astro check` による Astro ファイルの検査と、
TypeScript 7 による TypeScript ファイルの検査を順に実行します。
`astro check` は TypeScript 6 の API を必要とするため、
[TypeScript 公式の併用構成](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)
に従って npm エイリアスを使っています。

| npm パッケージ名 | 使用する実装 | 用途 |
|---|---|---|
| `@typescript/native` | `typescript` 7 | `tsc` コマンド |
| `typescript` | `@typescript/typescript6` 6 | `astro check` の内部 API と `tsc6` コマンド |

`typecheck` は `node node_modules/@typescript/native/bin/tsc --noEmit` を使い、
インストール順にかかわらず TypeScript 7 を実行します。

## プロジェクト構造

```
src/
├── content/
│   ├── blog/       # ブログ記事 (Markdown)
│   ├── pages/      # 固定ページ
│   └── config.ts   # コンテンツコレクション設定
├── components/     # Astro コンポーネント
├── lib/            # ユーティリティ
└── pages/          # ルーティング
public/             # 静的ファイル
```

## デプロイ

- **Cloudflare Pages** (primary): `wrangler.toml` の設定に従い自動デプロイ。詳細は [docs/cloudflare-pages.md](./docs/cloudflare-pages.md) を参照
