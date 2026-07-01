import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? (
        await supabase
          .from("profiles")
          .select("avatar_url, display_name")
          .eq("id", user.id)
          .single()
      ).data
    : null;

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="絶妙コラム"
            className="h-4 w-auto sm:h-5 dark:invert"
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/columns/new"
                className="inline-flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100"
              >
                <PencilSquareIcon className="h-4 w-4" aria-hidden />
                投稿
              </Link>
              <Link
                href="/mypage"
                className="shrink-0 rounded-full ring-2 ring-transparent transition-[box-shadow] hover:ring-zinc-200 dark:hover:ring-zinc-700"
                aria-label="マイページ"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {profile?.display_name?.charAt(0) ?? "?"}
                  </div>
                )}
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <Cog6ToothIcon className="h-4 w-4" aria-hidden />
                設定
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden />
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
