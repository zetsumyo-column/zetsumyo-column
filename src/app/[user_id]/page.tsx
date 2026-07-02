import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { ColumnListItem } from "@/components/column/column-list-item";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileListEmpty } from "@/components/profile/profile-list-item";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedColumnsByAuthor } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { getProfileByUserId } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

type UserProfilePageProps = {
  params: Promise<{ user_id: string }>;
};

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { user_id } = await params;
  const { data: profile } = await getProfileByUserId(user_id);

  if (!profile) {
    return { title: "ユーザーが見つかりません" };
  }

  return { title: profile.display_name };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { user_id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  if (user?.id === profile.id) {
    redirect("/mypage");
  }

  const [{ data: columns, error: columnsError }, followInfo] = await Promise.all([
    getPublishedColumnsByAuthor(profile.id),
    getFollowInfo(profile.id, user?.id),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="page">
        <ProfilePageHeader
          profile={profile}
          followerCount={followInfo.followerCount}
          followingCount={followInfo.followingCount}
          actions={
            <FollowButton
              className="mt-4"
              targetProfileId={profile.id}
              initialFollowing={followInfo.isFollowing}
              isLoggedIn={!!user}
            />
          }
        />

        <section className="section">
          {columnsError && (
            <p className="alert-error mt-4">コラムの取得に失敗しました。</p>
          )}

          {!columnsError && (!columns || columns.length === 0) && (
            <ProfileListEmpty message="まだコラムがありません" className="mt-4" />
          )}

          {!columnsError && columns && columns.length > 0 && (
            <ul className="column-feed-list">
              {(columns as ColumnListItemType[]).map((column) => (
                <ColumnListItem key={column.id} column={column} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
