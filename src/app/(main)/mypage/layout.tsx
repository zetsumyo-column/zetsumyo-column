import { redirect } from "next/navigation";

import { MypageColumnNav } from "@/components/column/mypage-column-nav";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { getPublishedColumnStats } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type MypageLayoutProps = {
  children: React.ReactNode;
};

export default async function MypageLayout({ children }: MypageLayoutProps) {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login?next=/mypage");
  }

  const supabase = await createClient();
  const [{ data: profile, error: profileError }, columnStats, followInfo] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      getPublishedColumnStats(user.id),
      getFollowInfo(user.id),
    ]);

  if (profileError || !profile) {
    return (
      <div className="auth-page">
        <p className="muted">プロフィールの取得に失敗しました。再度ログインしてください。</p>
      </div>
    );
  }

  return (
    <div className="page">
      <ProfilePageHeader
        profile={profile}
        columnCount={columnStats.columnCount}
        totalCharacterCount={columnStats.totalCharacterCount}
        followerCount={followInfo.followerCount}
        followingCount={followInfo.followingCount}
      />
      <MypageColumnNav />
      {children}
    </div>
  );
}
