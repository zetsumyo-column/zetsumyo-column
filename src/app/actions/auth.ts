"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_NEXT_COOKIE, AUTH_NEXT_COOKIE_MAX_AGE } from "@/lib/auth/oauth-next";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { resolveAuthSiteUrl } from "@/lib/auth/site-url";
import { createClient } from "@/lib/supabase/server";

type AuthMode = "login" | "signup";

async function signInWithGoogleOAuth(
  mode: AuthMode,
  next?: string,
  clientOrigin?: string,
) {
  const supabase = await createClient();
  const errorPath = mode === "signup" ? "/signup" : "/login";
  const safeNext = getSafeRedirectPath(next);
  const siteUrl = await resolveAuthSiteUrl(clientOrigin);
  const callbackUrl = new URL("/auth/callback", siteUrl);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_NEXT_COOKIE, safeNext, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_NEXT_COOKIE_MAX_AGE,
    path: "/",
  });

  if (process.env.NODE_ENV === "development") {
    console.info("[auth] OAuth callback:", callbackUrl.toString());
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        access_type: "offline",
        prompt: mode === "signup" ? "consent" : "select_account",
      },
    },
  });

  if (error) {
    redirect(`${errorPath}?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect(`${errorPath}?error=auth_failed`);
}

export async function signInWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  const origin = String(formData.get("origin") ?? "");
  await signInWithGoogleOAuth("login", next, origin);
}

export async function signUpWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  const origin = String(formData.get("origin") ?? "");
  await signInWithGoogleOAuth("signup", next, origin);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
