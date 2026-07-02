import { NextResponse, type NextRequest } from "next/server";

import { AUTH_NEXT_COOKIE } from "@/lib/auth/oauth-next";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { getRequestSiteUrlFromRequest } from "@/lib/auth/site-url";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const siteUrl = getRequestSiteUrlFromRequest(request);

  const next = getSafeRedirectPath(
    request.cookies.get(AUTH_NEXT_COOKIE)?.value ??
      searchParams.get("next"),
  );

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${siteUrl}${next}`);
      response.cookies.delete(AUTH_NEXT_COOKIE);
      return response;
    }
  }

  const response = NextResponse.redirect(
    `${siteUrl}/login?error=${encodeURIComponent("認証に失敗しました")}`,
  );
  response.cookies.delete(AUTH_NEXT_COOKIE);
  return response;
}
