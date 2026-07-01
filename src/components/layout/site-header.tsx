import Image from "next/image";
import Link from "next/link";

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
    <header className="header">
      <div className="header-inner">
        <Link href="/">
          <img
            src="/logo.svg"
            alt="絶妙コラム"
            className="h-4 w-auto sm:h-5 dark:invert"
          />
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <Link href="/mypage" aria-label="マイページ">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="avatar h-8 w-8 text-xs">
                  {profile?.display_name?.charAt(0) ?? "?"}
                </div>
              )}
            </Link>
          ) : (
            <Link href="/login" className="nav-link">
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
