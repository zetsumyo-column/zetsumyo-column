export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL が設定されていません");
  }
  // Data API 画面から /rest/v1/ 付きでコピーした場合の誤りを補正
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません");
  }
  return key;
}

export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (process.env.NODE_ENV === "development") {
    try {
      const { hostname } = new URL(configured);
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        return "http://localhost:3000";
      }
    } catch {
      return "http://localhost:3000";
    }
  }

  return configured;
}
