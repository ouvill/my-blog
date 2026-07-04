# Blog Improvement Tasks

コンテンツ本文以外の、ブログ基盤として改善したい項目を記録する。

## High Priority

- [x] `/` と `/indexes/0/` の重複を解消する
  - 対象: `src/pages/indexes/[page].astro`
  - 現状: `getStaticPaths()` が `0` ページも生成しており、`/indexes/0/` が
    `/` と同じ記事一覧になる。
  - 対応案: `/indexes/0/` を生成しない。必要なら旧 URL から `/` へ
    リダイレクトする。
  - 確認: `npm run build` 後、`dist/sitemap-0.xml` に
    `https://blog.ouvill.net/indexes/0/` が含まれないこと。

- [x] 主要ページに canonical URL を設定する
  - 対象: `src/pages/index.astro`, `src/pages/indexes/[page].astro`,
    `src/pages/contact.astro`
  - 現状: タグ・カテゴリ一覧は canonical があるが、トップページや
    ページネーションにはない。
  - 対応案: `BaseLayout` に `canonicalUrl` を渡す。
  - 確認: 生成 HTML に `<link rel="canonical" ...>` が出力されること。

- [x] 記事の description を本文抜粋で補完する
  - 対象: `src/pages/blog/[...slug].astro`, `src/pages/rss.xml.ts`,
    `src/pages/index.astro`
  - 現状: frontmatter の `description` がない記事では、記事ページの
    meta description がサイト共通文言になる。
  - 対応案: トップページ内の抜粋生成処理を `src/lib/` に共通化し、
    記事ページと RSS でも使う。
  - 確認: description 未設定記事の生成 HTML と RSS item に、記事本文由来の
    短い説明が入ること。

## Medium Priority

- [x] 記事ページ向けのメタデータを強化する
  - 対象: `src/components/BaseLayout.astro`, `src/pages/blog/[...slug].astro`
  - 現状: 記事ページでも `og:type` が常に `website`。
  - 対応案: 記事ページでは `og:type=article`、`article:published_time`、
    `article:tag`、JSON-LD `BlogPosting` を出力する。
  - 確認: 記事 HTML に記事向け OGP と `application/ld+json` が出力されること。

- [x] 記事カードのカバー画像に寸法情報を渡す
  - 対象: `src/lib/cover.ts`, `src/components/PostCard.astro`,
    `src/pages/index.astro`
  - 現状: `resolveCoverOrNull()` は URL のみを返すため、記事カードの
    `<img>` に `width` / `height` がない。
  - 対応案: 画像 URL と `width` / `height` を返す API を追加し、カード画像に
    寸法属性を付ける。
  - 確認: 生成 HTML の記事カード画像に `width` / `height` が出力されること。

- [x] `robots.txt` に Sitemap の場所を明記する
  - 対象: `public/robots.txt`
  - 現状: crawl 許可だけで Sitemap 行がない。
  - 対応案: `Sitemap: https://blog.ouvill.net/sitemap-index.xml` を追加する。
  - 確認: `dist/robots.txt` に Sitemap 行が含まれること。

## Low Priority

- [x] `ClientRouter` が必要か見直す
  - 対象: `src/components/BaseLayout.astro`
  - 現状: 全ページに Astro view transitions 用 JS が入る。
  - 判断基準: ページ遷移演出を維持したいなら継続。静的ブログとして軽量化を
    優先するなら削除を検討する。
  - 確認: 削除する場合はテーマ切り替え、コードコピー、目次スクロールが
    通常遷移で問題なく動くこと。

- [x] Astro バージョン表記を実依存に合わせる
  - 対象: `AGENTS.md`
  - 現状: `AGENTS.md` は Astro v5 と記載しているが、`package.json` は
    `astro` `^7.0.6`。
  - 対応案: ドキュメントのバージョン表記を更新する。
  - 確認: プロジェクト説明と `package.json` の依存バージョンに矛盾がないこと。
