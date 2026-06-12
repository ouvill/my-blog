# Ouvill のブログ

[blog.ouvill.net](https://blog.ouvill.net) — IT 技術ブログ

Astro ベースの静的サイトです。

## 開発

```bash
yarn dev        # 開発サーバー起動 (http://localhost:4321)
yarn build      # プロダクションビルド
yarn preview    # ビルド結果のプレビュー
yarn typecheck  # 型チェック
```

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
