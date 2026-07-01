import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { BackLink } from "@/components/ui/back-link";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
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

        <GoogleAuthButton mode="login" />

        <p className="muted mt-6 text-center">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="link">
            新規登録
          </Link>
        </p>

        <p className="hint mt-4 text-center">
          <BackLink href="/">トップに戻る</BackLink>
        </p>
      </div>
    </div>
  );
}
