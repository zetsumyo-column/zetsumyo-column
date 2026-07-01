import Link from "next/link";

import { HeaderUserMenu } from "@/components/layout/header-user-menu";
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
          .select("avatar_url, display_name, user_id")
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
          {user && profile ? (
            <HeaderUserMenu
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name}
              userId={profile.user_id}
            />
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
