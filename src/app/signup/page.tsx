import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { BackLink } from "@/components/ui/back-link";
import { getRequestSiteUrl } from "@/lib/auth/site-url";
import { createClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const origin = await getRequestSiteUrl();

  return (
    <div className="auth-page">
      <div className="page-narrow w-full">
        <h1 className="title mb-8 text-center">新規登録</h1>

        {error && <p className="alert-error mb-4">{decodeURIComponent(error)}</p>}

        <GoogleAuthButton mode="signup" origin={origin} />

        <p className="muted mt-6 text-center">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="link">
            ログイン
          </Link>
        </p>

        <BackLink href="/" className="hint mt-4 block text-center">
          トップに戻る
        </BackLink>
      </div>
    </div>
  );
}
