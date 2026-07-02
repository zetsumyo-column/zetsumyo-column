import { redirect } from "next/navigation";

import { MypageColumnNav } from "@/components/column/mypage-column-nav";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { getPublishedColumnsByAuthor, sumPlainTextLength } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { createClient } from "@/lib/supabase/server";

type MypageLayoutProps = {
  children: React.ReactNode;
};

export default async function MypageLayout({ children }: MypageLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/mypage");
  }

  const [{ data: profile, error: profileError }, { data: columns }, followInfo] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      getPublishedColumnsByAuthor(user.id),
      getFollowInfo(user.id),
    ]);

  if (profileError || !profile) {
    return (
      <>
        <SiteHeader />
        <div className="auth-page">
          <p className="muted">プロフィールの取得に失敗しました。再度ログインしてください。</p>
        </div>
      </>
    );
  }

  const publishedColumns = columns ?? [];

  return (
    <>
      <SiteHeader />
      <div className="page">
        <ProfilePageHeader
          profile={profile}
          columnCount={publishedColumns.length}
          totalCharacterCount={sumPlainTextLength(publishedColumns)}
          followerCount={followInfo.followerCount}
          followingCount={followInfo.followingCount}
        />
        <MypageColumnNav />
        {children}
      </div>
    </>
  );
}
