import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { BackLink } from "@/components/ui/back-link";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;
  const safeNext = getSafeRedirectPath(next);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(safeNext);
  }

  return (
    <div className="auth-page">
      <div className="page-narrow w-full">
        <div className="mb-8 text-center">
          <h1 className="title">ログイン</h1>
          <p className="muted mt-2">絶妙コラムにログインしてください</p>
        </div>

        {error && (
          <p className="alert-error mb-4">{decodeURIComponent(error)}</p>
        )}

        <GoogleAuthButton mode="login" next={safeNext === "/" ? undefined : safeNext} />

        <p className="muted mt-6 text-center">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="link">
            新規登録
          </Link>
        </p>

        <BackLink href="/" className="hint mt-4 block text-center">
          トップに戻る
        </BackLink>
      </div>
    </div>
  );
}
