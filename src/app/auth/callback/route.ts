import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/mypage";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${getSiteUrl()}${next}`);
    }
  }

  return NextResponse.redirect(
    `${getSiteUrl()}/login?error=${encodeURIComponent("認証に失敗しました")}`,
  );
}
