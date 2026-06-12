# Cloudflare Pages へのデプロイ

本サイトは **Cloudflare Pages** でホストされています。以前は Netlify で運用していましたが、Cloudflare Pages へ移行済みです。

## 設定ファイル

| ファイル | 役割 |
|---|---|
| `wrangler.toml` | Cloudflare Pages のビルド設定 (`pages_build_output_dir`, `compatibility_date`) および Email Sending / D1 binding |
| `public/_redirects` | リダイレクトルール (Cloudflare Pages 互換形式) |
| `functions/api/contact.ts` | Cloudflare Pages Functions — お問い合わせフォーム処理 |
| `migrations/0001_create_contact_submissions.sql` | D1 初期スキーマ (contact_submissions テーブル) |

> `netlify.toml` は移行時に削除済みです。

## Build Settings (Cloudflare Pages ダッシュボード)

| 項目 | 設定値 |
|---|---|
| Framework preset | **Astro** (推奨) または **None** |
| Build command | `yarn build` |
| Build output directory | `dist` |
| Node.js version | **22** (環境変数 `NODE_VERSION=22` を設定) |

### 環境変数

Cloudflare Pages の管理画面 → 該当プロジェクト → **Settings → Environment variables** で以下を追加:

| Variable name | Value | 用途 |
|---|---|---|
| `NODE_VERSION` | `22` | ビルド時の Node.js バージョン固定 |
| `CONTACT_TO_EMAIL` | `<受信メールアドレス>` | お問い合わせの送信先 |
| `CONTACT_FROM_EMAIL` | `<送信元メールアドレス>` | Email Sending で検証済みドメインのアドレス |

> Node.js 22 を指定しないとデフォルトの古いバージョンが使われ、ビルドが失敗します。
> Framework preset に Astro を選ぶと自動的に適切な Node バージョンが選択される場合もありますが、明示的に `NODE_VERSION=22` を設定することを推奨します。

## 問い合わせフォーム

`/contact/` のフォームは **Cloudflare Pages Functions** (`functions/api/contact.ts`) で処理されます。

### 動作フロー

1. ユーザーがフォームを POST → `/api/contact`
2. Function が FormData を受信・バリデーション
3. Honeypot (`botField`) に入力がある場合 → D1 に保存せずメール送信せず `/contact/success/` へ 303 redirect (ボット対策)
4. バリデーションエラー → `/contact/?status=validation_error` へ 303 redirect (フォーム側でメッセージ表示)
5. D1 (`env.CONTACT_DB`) に `email_status = 'pending'` で問い合わせを保存
   - D1 binding 未設定または insert 失敗 → メール送信せず `/contact/?status=server_error` へ 303 redirect
6. Cloudflare Email Service の `send_email` binding (`env.EMAIL.send(...)`) で管理者にメール送信
7. メール送信成功 → D1 の `email_status` を `sent` に更新 (best-effort) → `/contact/success/` へ 303 redirect
8. メール送信失敗 → D1 の `email_status` を `failed` に更新 (best-effort) → `/contact/?status=server_error` へ 303 redirect (詳細はサーバーログのみ)
9. フォームデータ解析失敗時 → `/contact/?status=invalid_request` へ 303 redirect

> D1 に保存できない問い合わせはメール送信もしません。保存できないのにメールだけ送ると、追跡できない問い合わせが発生するためです。

> すべてのエラーは HTML フォームへの redirect で返されるため、ブラウザに JSON が表示されることはありません。`/api/contact` への POST 以外の直接アクセスのみ JSON 405 を返します。

### Cloudflare Email Service の前提条件

- **Workers Paid plan** が必要です (Free plan では `send_email` binding は利用できません)。
- **Email Sending は Beta** です。API や動作が変更される可能性があります。
- `CONTACT_FROM_EMAIL` に指定するドメインは、Cloudflare ダッシュボードで **Email Sending の domain onboarding** が完了している必要があります。
- Cloudflare DNS で管理されているドメインを使用することを推奨します。

### Cloudflare D1 の設定手順

お問い合わせ内容を Cloudflare D1 (SQLite 互換) に保存します。以下の手順で D1 データベースを作成・binding 設定・migration 適用を行います。

#### 1. D1 データベース作成

```bash
wrangler d1 create ouvill-blog-contact
```

実行すると `database_id` が表示されるので控えておきます。

#### 2. wrangler.toml の `[[d1_databases]]` を有効化

`wrangler.toml` にコメントアウトでテンプレートが記載されています。D1 作成後にコメントを外し、`database_id` を設定してください:

```toml
[[d1_databases]]
binding = "CONTACT_DB"
database_name = "ouvill-blog-contact"
database_id = "<YOUR_D1_DATABASE_ID>"
```

> `binding = "CONTACT_DB"` — Pages Function 内で `env.CONTACT_DB` としてアクセスします。

#### 3. Migration 適用 (リモート)

```bash
wrangler d1 execute ouvill-blog-contact --remote \
  --file=./migrations/0001_create_contact_submissions.sql
```

#### 4. Cloudflare Pages ダッシュボードでの binding 確認

Cloudflare Pages ダッシュボード → 該当プロジェクト → **Settings → Functions → D1 database bindings** で `CONTACT_DB` binding が正しく設定されていることを確認してください。

> **`CONTACT_DB` 未設定時は `server_error` になります。** D1 に保存できない問い合わせはメール送信もしない仕様のため、D1 binding が無いと問い合わせフォームが完全に機能しません。

#### D1 保存データ

| Column | 型 | 説明 |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY` | 自動採番 |
| `name` | `TEXT NOT NULL` | お名前 |
| `email` | `TEXT NOT NULL` | メールアドレス |
| `message` | `TEXT NOT NULL` | お問い合わせ内容 |
| `email_status` | `TEXT NOT NULL` | `pending` / `sent` / `failed` |
| `created_at` | `TEXT NOT NULL` | 保存日時 (ISO 8601) |
| `updated_at` | `TEXT NOT NULL` | 最終更新日時 (ISO 8601) |

> 各カラムの長さ制限: `name` 100 文字, `email` 254 文字, `message` 5000 文字。アプリ側でも同様の制限を設けています。

#### 個人情報に関する注意事項

- **IP アドレス・User-Agent は保存しません。** フォームから送信された `name`, `email`, `message` のみ保存します。
- Honeypot に引っかかったボット入力は D1 に保存しません。
- **保存期間・削除運用は別途決めて運用開始前に整備してください。** 個人情報保護法・GDPR 等の適用範囲を確認し、不要になったデータの削除方針を定めておくことを推奨します。

### wrangler.toml の `send_email` binding

```toml
[[send_email]]
name = "EMAIL"
```

- `name = "EMAIL"` — Pages Function 内で `env.EMAIL` としてアクセスします。
- `wrangler.toml` への記載に加え、Cloudflare Pages ダッシュボードの **Functions → Bindings** 設定でも `EMAIL` binding が正しく反映・設定されていることを確認してください。設定がない場合は `server_error` になります。

### 使用している環境変数 / binding

| 変数名 / binding 名 | 説明 |
|---|---|
| `EMAIL` (send_email binding) | Cloudflare Email Service の送信 binding。`wrangler.toml` で定義。未設定の場合 `/contact/?status=server_error` へ redirect |
| `CONTACT_DB` (d1_databases binding) | Cloudflare D1 の送信 binding。`wrangler.toml` で定義。未設定の場合 `/contact/?status=server_error` へ redirect (D1 保存ができないためメール送信もしない) |
| `CONTACT_TO_EMAIL` | メール送信先。未設定の場合 `/contact/?status=server_error` へ redirect |
| `CONTACT_FROM_EMAIL` | メール送信元 (Email Sending で検証済みドメイン)。未設定の場合 `/contact/?status=server_error` へ redirect |

### ローカル確認方法

Cloudflare Pages Functions のローカル実行には `wrangler pages dev` を使用します:

```bash
# 1. ビルド
yarn build

# 2. ローカル起動 (env binding のみ設定)
wrangler pages dev dist \
  --binding CONTACT_TO_EMAIL=to@example.com \
  --binding CONTACT_FROM_EMAIL=from@example.com
```

> `wrangler pages dev` では Email Service binding や D1 binding はローカル環境でエミュレートされません。実際の Email Service 送信や D1 への保存は本番環境または Cloudflare の remote 環境 (preview deployment) で確認してください。ローカルでの各 binding の挙動は Cloudflare の仕様変更があり得るため、本番デプロイ前に preview deployment で必ず動作確認を行ってください。

## `_redirects` の互換性

Cloudflare Pages も `public/_redirects` の一括リダイレクトをサポートしています。Netlify から移行する際は以下の違いに注意が必要です:

| 機能 | Netlify | Cloudflare Pages |
|---|---|---|
| ステータスコードの `!` 接尾辞 (force redirect) | `301!` で「ファイルが存在しても強制リダイレクト」 | `!` は**未サポート**。`301` のみ |
| ドメイン全体のリダイレクト | 正常に動作 | 通常は不要。独自ドメイン設定のみ |

本プロジェクトの `public/_redirects` は Cloudflare Pages 向けに以下のように調整済みです:

- すべての `301!` → `301` に変更
- Netlify サブドメイン (`jovial-nobel-357f47.netlify.com`) へのリダイレクト行は削除
- パスベースのリダイレクトはそのまま維持

> `!` を取り除いても、リダイレクト元に該当するファイルが存在しないため実質的な影響はありません。

## その他の注意点

- **Sitemap**: `@astrojs/sitemap` が出力する `sitemap-index.xml` はそのまま Cloudflare で動作します。
- **RSS**: `/rss.xml` は静的ファイルとして出力されるため、追加設定不要です。
- **画像最適化**: Astro ビルド時に `sharp` を使って最適化済みなので、Cloudflare 側での追加設定は不要です。
- **Trailing slash**: `astro.config.mjs` で `trailingSlash: "always"` と設定されています。Cloudflare Pages はデフォルトで trailing slash の有無を区別しないため、問題ありません。

## 参考リンク

- [Cloudflare Pages — Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare Pages — Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages — Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Email Service — Email Sending](https://developers.cloudflare.com/email-service/)
- [Cloudflare Email Service — Workers binding](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare D1 — Client API](https://developers.cloudflare.com/d1/worker-api/)
