import Link from "next/link";

import { HeaderLikeNotifications } from "@/components/layout/header-like-notifications";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { getHeaderProfile } from "@/lib/profile/header";
import { getAuthUser } from "@/lib/supabase/auth";

export async function SiteHeader() {
  const [{ user }, profile] = await Promise.all([getAuthUser(), getHeaderProfile()]);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/">
          <img
            src="/logo.svg"
            alt="絶妙コラム"
            className="h-4 w-auto sm:h-5 dark:hidden"
          />
          <img
            src="/logo-dark.svg"
            alt=""
            aria-hidden
            className="hidden h-4 w-auto sm:h-5 dark:block"
          />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4">
          {user && profile?.user_id ? (
            <>
              <HeaderLikeNotifications authorUserId={profile.user_id} />
              <HeaderUserMenu
                avatarUrl={profile.avatar_url}
                displayName={profile.display_name ?? profile.user_id}
                userId={profile.user_id}
              />
            </>
          ) : (
            <Link href="/login" className="btn">
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
