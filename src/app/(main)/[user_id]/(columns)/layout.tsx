import { notFound } from "next/navigation";

import { MypageColumnNav } from "@/components/column/mypage-column-nav";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { getPublishedColumnStats } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";

type ProfileColumnsLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ user_id: string }>;
};

export default async function ProfileColumnsLayout({
  children,
  params,
}: ProfileColumnsLayoutProps) {
  const { user_id } = await params;
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  const isOwner = user?.id === profile.id;

  const [columnStats, followInfo] = await Promise.all([
    getPublishedColumnStats(profile.id),
    getFollowInfo(profile.id, user?.id),
  ]);

  return (
    <div className="page">
      <ProfilePageHeader
        profile={profile}
        columnCount={columnStats.columnCount}
        totalCharacterCount={columnStats.totalCharacterCount}
        followerCount={followInfo.followerCount}
        followingCount={followInfo.followingCount}
        actions={
          !isOwner ? (
            <FollowButton
              className="mt-4"
              targetProfileId={profile.id}
              initialFollowing={followInfo.isFollowing}
              isLoggedIn={!!user}
            />
          ) : undefined
        }
      />
      {isOwner && <MypageColumnNav userId={user_id} />}
      {children}
    </div>
  );
}
