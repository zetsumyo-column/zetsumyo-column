import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { ColumnListItem } from "@/components/column/column-list-item";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileListEmpty } from "@/components/profile/profile-list-item";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { getPublishedColumnsByAuthor, sumPlainTextLength } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";
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
  const { user } = await getAuthUser();
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

  const publishedColumns = (columns ?? []) as ColumnListItemType[];

  return (
    <div className="page">
      <ProfilePageHeader
        profile={profile}
        columnCount={publishedColumns.length}
        totalCharacterCount={sumPlainTextLength(publishedColumns)}
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

        {!columnsError && publishedColumns.length > 0 && (
          <ul className="column-feed-list">
            {publishedColumns.map((column) => (
              <ColumnListItem key={column.id} column={column} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
