"use server";

import { redirect } from "next/navigation";

import { getSiteUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type AuthMode = "login" | "signup";

async function signInWithGoogleOAuth(mode: AuthMode) {
  const supabase = await createClient();
  const errorPath = mode === "signup" ? "/signup" : "/login";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
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

export async function signInWithGoogle() {
  await signInWithGoogleOAuth("login");
}

export async function signUpWithGoogle() {
  await signInWithGoogleOAuth("signup");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
