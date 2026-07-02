import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { BackLink } from "@/components/ui/back-link";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { getAuthUser } from "@/lib/supabase/auth";
import { getRequestSiteUrl } from "@/lib/auth/site-url";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string; deleted?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next, deleted } = await searchParams;
  const safeNext = getSafeRedirectPath(next);
  const { user } = await getAuthUser();

  if (user) {
    redirect(safeNext);
  }

  const origin = await getRequestSiteUrl();

  return (
    <div className="auth-page">
      <div className="page-narrow w-full">
        <div className="mb-8 text-center">
          <h1 className="title">ログイン</h1>
          <p className="muted mt-2">絶妙コラムにログインしてください</p>
        </div>

        {deleted && (
          <p className="alert-success mb-4">アカウントを削除しました。</p>
        )}

        {error && <p className="alert-error mb-4">{decodeURIComponent(error)}</p>}

        <GoogleAuthButton mode="login" origin={origin} next={safeNext === "/" ? undefined : safeNext} />

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
