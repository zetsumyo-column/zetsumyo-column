import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight"
        >
          絶妙コラム
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/columns"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            コラム一覧
          </Link>
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
