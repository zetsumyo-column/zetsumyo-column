# Cloudflare Workers デプロイ手順

## GitHub 連携デプロイ（推奨）

Cloudflare Dashboard → **Workers** → `zetsumyo-column` → **Settings** → **Build**

| 項目 | 値 |
|---|---|
| **Build command** | `npm run build:workers` |
| **Deploy command** | `npx wrangler deploy` |

> `npm run build`（= `next build` のみ）だと `.open-next/` が生成されずデプロイに失敗します。

### 環境変数（Variables and Secrets）

| 変数名 | 値 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` |
| `NEXT_PUBLIC_SITE_URL` | 本番 URL（例: `https://zetsumyo-column.xxxxx.workers.dev`） |
| `NEXTJS_ENV` | `production` |

### Supabase Redirect URLs

Dashboard → **Authentication** → **URL Configuration**

- Site URL: 本番 URL
- Redirect URLs: `https://（本番URL）/auth/callback`

---

## CLI からデプロイする場合

```bash
npx wrangler login
npm run deploy
```

## ローカルで Workers 互換確認

```bash
npm run preview
```

`.dev.vars` に Supabase の環境変数を設定してください。
