import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="絶妙コラム"
            className="h-4 w-auto sm:h-5"
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/columns/new"
                className="font-medium text-zinc-900 dark:text-zinc-100"
              >
                投稿
              </Link>
              <Link
                href="/mypage"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                マイページ
              </Link>
              <Link
                href="/settings"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                設定
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
