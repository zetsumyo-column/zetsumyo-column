"use server";

import { redirect } from "next/navigation";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { getSiteUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type AuthMode = "login" | "signup";

async function signInWithGoogleOAuth(mode: AuthMode, next?: string) {
  const supabase = await createClient();
  const errorPath = mode === "signup" ? "/signup" : "/login";
  const safeNext = getSafeRedirectPath(next);
  const callbackUrl = new URL("/auth/callback", getSiteUrl());
  callbackUrl.searchParams.set("next", safeNext);

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
  await signInWithGoogleOAuth("login", next);
}

export async function signUpWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  await signInWithGoogleOAuth("signup", next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
