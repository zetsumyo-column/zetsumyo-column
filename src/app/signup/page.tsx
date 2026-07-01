import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
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

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">新規登録</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Googleアカウントで絶妙コラムに登録できます
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {decodeURIComponent(error)}
          </p>
        )}

        <GoogleAuthButton mode="signup" />

        <p className="mt-6 text-center text-sm text-zinc-500">
          すでにアカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            ログイン
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-zinc-500">
          <Link href="/" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            トップに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
