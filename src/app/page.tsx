import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <main className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">絶妙コラム</h1>
            <p className="mt-3 text-zinc-500">文字数制限コラムサービス</p>
          </div>

          <Link
            href="/columns"
            className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            コラムを読む
          </Link>

          {user ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/columns/new"
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-8 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                コラムを投稿
              </Link>
              <Link
                href="/mypage"
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-8 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                マイページ
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-8 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-8 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                新規登録
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
