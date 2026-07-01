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
2. `supabase/sql/002_columns.sql`（コラム投稿機能）
3. `supabase/sql/003_columns_tiptap.sql`（TipTap HTML 対応）
4. `supabase/sql/004_columns_title.sql`（タイトル列の追加）
5. `supabase/sql/005_columns_char_limit_fixed.sql`（文字数上限を140文字に固定）
6. `supabase/sql/006_profiles_bio.sql`（自己紹介文の追加）
7. `supabase/sql/007_columns_status.sql`（下書き・公開ステータス）

### 既にセットアップ済みの場合

`001` や `002` は **再実行しないでください**（`relation "columns" already exists` エラーになります）。

未実行のファイルだけ順番に実行してください。例:

- 下書き機能を使う → `007_columns_status.sql` のみ
- 自己紹介文が保存できない → `006_profiles_bio.sql` のみ

各ファイルは `IF NOT EXISTS` や `DROP CONSTRAINT IF EXISTS` で冪等に書いてあるため、**003〜007 は未適用分だけ**実行すれば問題ありません。

## 3. 環境変数を設定

### ローカル開発（`npm run dev`）

```bash
cp .env.local.example .env.local
```

`.env.local` に Supabase の **Project URL** と **anon public key** を記入。

取得先: Dashboard → **Project Settings** → **API**

### Cloudflare プレビュー（`npm run preview`）

`.dev.vars` にも同じ値を追加:

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:8787
```

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
- `src/app/mypage/` — プロフィール編集画面
- `src/app/auth/callback/` — OAuth コールバック
- `src/components/auth/google-login-button.tsx`
- `src/components/profile/profile-form.tsx`

### 動作確認

```bash
cp .env.local.example .env.local
# .env.local に Supabase の URL / Anon Key を記入

npm run dev
```

1. http://localhost:3000/login で「Googleでログイン」
2. 認証後 `/mypage` にリダイレクト
3. ID・ユーザー名を編集して保存
