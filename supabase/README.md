# Supabase セットアップ手順（ステップ 1）

## 1. Google OAuth を有効化

Supabase Dashboard → **Authentication** → **Providers** → **Google**

1. Enable Google provider を ON
2. Google Cloud Console で OAuth 2.0 クライアント ID を作成
3. Client ID / Client Secret を Supabase に入力

**Authorized redirect URIs**（Google Cloud Console 側）:

```
https://<project-ref>.supabase.co/auth/v1/callback
```

## 2. SQL を実行

### 初回セットアップ（テーブルがまだない場合）

**SQL Editor** で以下を順番に実行:

1. `supabase/sql/001_profiles.sql`（未実行の場合）
2. `supabase/sql/002_columns.sql`（コラム投稿機能・新規は1400文字固定）
3. `supabase/sql/003_columns_tiptap.sql`（TipTap HTML 対応）
4. `supabase/sql/004_columns_title.sql`（タイトル列の追加・002に含まれる場合は不要）
5. `supabase/sql/006_profiles_bio.sql`（自己紹介文の追加）
6. `supabase/sql/007_columns_status.sql`（下書き・公開ステータス）
7. `supabase/sql/008_columns_char_limit_1400.sql`（文字数上限を1400文字に変更・002適用済みなら不要）
8. `supabase/sql/009_column_likes.sql`（いいね機能）
9. `supabase/sql/010_user_follows.sql`（フォロー機能）
10. `supabase/sql/011_avatars_storage.sql`（プロフィール画像のアップロード）
11. `supabase/sql/012_column_views.sql`（閲覧数）
12. `supabase/sql/013_columns_plain_text_length.sql`（一覧用の文字数列）
13. `supabase/sql/014_columns_draft_only_mutations.sql`（公開コラムの改ざん防止）
14. `supabase/sql/015_columns_plain_text_length_no_whitespace.sql`（文字数から空白・改行を除外）
15. `supabase/sql/016_profiles_preserve_custom_avatar.sql`（カスタムプロフィール画像の上書き防止）
16. `supabase/sql/017_columns_title_length.sql`（タイトルを10〜30文字に制限）
17. `supabase/sql/018_profiles_sns_links.sql`（プロフィールのSNSリンク）
18. `supabase/sql/019_profiles_remove_facebook_sns.sql`（Facebookリンク列の削除・018適用済み向け）
19. `supabase/sql/020_columns_public_id.sql`（コラムURL用の短い public_id）
20. `supabase/sql/021_columns_allow_author_delete.sql`（公開済みコラムの削除を許可）

### 既にセットアップ済みの場合

`001` や `002` は **再実行しないでください**（`relation "profiles" already exists` などのエラーになります）。

未実行のファイルだけ順番に実行してください。例:

- 下書き機能を使う → `007_columns_status.sql` のみ
- 自己紹介文が保存できない → `006_profiles_bio.sql` のみ
- 文字数上限を変更する → `008_columns_char_limit_1400.sql` のみ
- いいね機能を使う → `009_column_likes.sql` のみ
- フォロー機能を使う → `010_user_follows.sql` のみ
- プロフィール画像を変更する → `011_avatars_storage.sql` のみ
- 閲覧数を表示する → `012_column_views.sql` のみ
- 一覧の文字数表示を最適化する → `013_columns_plain_text_length.sql` のみ
- 公開コラムの DB 保護を強化する → `014_columns_draft_only_mutations.sql` のみ
- 文字数を空白・改行なしで数える → `015_columns_plain_text_length_no_whitespace.sql` のみ
- プロフィール画像が再ログインでリセットされる → `016_profiles_preserve_custom_avatar.sql` のみ
- タイトルを10〜30文字に制限する → `017_columns_title_length.sql` のみ
- プロフィールにSNSリンクを表示する → `018_profiles_sns_links.sql` のみ
- Facebookリンク列を削除する → `019_profiles_remove_facebook_sns.sql` のみ（018適用済みの場合）
- コラムURLを `/{user_id}/{public_id}` 形式にする → `020_columns_public_id.sql` のみ
- 公開済みコラムを削除できるようにする → `021_columns_allow_author_delete.sql` のみ

各ファイルは `IF NOT EXISTS` や `DROP CONSTRAINT IF EXISTS` で冪等に書いてあるため、**003〜021 は未適用分だけ**実行すれば問題ありません。

## 3. 環境変数を設定

### 必須の環境変数

| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `NEXT_PUBLIC_SITE_URL` | OAuth コールバック後のサイト URL（**本番では必須**） |
| `SUPABASE_SERVICE_ROLE_KEY` | アカウント削除用（**サーバーのみ・クライアントに露出しない**） |

`NEXT_PUBLIC_SITE_URL` が未設定だと OAuth リダイレクトが `http://localhost:3000` にフォールバックし、本番ログインが失敗します。

取得先（Supabase）: Dashboard → **Project Settings** → **API**（service role key は **service_role** の secret）

### ローカル開発（`npm run dev`）

`.env.local` を作成し、上記3変数を記入:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Cloudflare プレビュー（`npm run preview`）

`.dev.vars` に同じ値を設定:

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:8787
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Cloudflare 本番デプロイ（`npm run deploy`）

1. 初回デプロイ後に表示された Workers URL を確認
2. `.env.production.local.example` を参考に、Cloudflare Dashboard の **Workers → 対象 Worker → Settings → Variables** に以下を設定:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://zetsumyo-column.<your-subdomain>.workers.dev
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

3. `NEXT_PUBLIC_SITE_URL` を設定したうえで **再デプロイ**
4. Supabase の **Redirect URLs** に `https://<本番URL>/auth/callback` を追加

## 4. Supabase の Redirect URLs を設定

Dashboard → **Authentication** → **URL Configuration**

| 項目 | ローカル開発 |
|---|---|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

Cloudflare プレビュー用にはデプロイ後に本番 URL も追加。

## 次のステップ（ステップ 2 完了）

Next.js 側の実装済み:

- `src/lib/supabase/` — クライアント初期化（browser / server / middleware）
- `src/middleware.ts` — セッション更新
- `src/app/login/` — Google ログイン画面
- `src/app/mypage/` — マイページ
- `src/app/settings/` — 設定（プロフィール・カラーモード・文字組み）
- `src/app/auth/callback/` — OAuth コールバック
- `src/components/auth/google-auth-button.tsx`
- `src/components/profile/profile-form.tsx`

### 動作確認

```bash
# .env.local に上記の環境変数を記入

npm run dev
```

1. http://localhost:3000/login で「Googleでログイン」
2. 認証後 `/mypage` にリダイレクト
3. ID・ユーザー名を編集して保存
