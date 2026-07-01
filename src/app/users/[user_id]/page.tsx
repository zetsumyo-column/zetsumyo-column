import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { ColumnListItem } from "@/components/column/column-list-item";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileFollowStats } from "@/components/profile/profile-follow-stats";
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
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="avatar h-20 w-20 text-2xl">
                {profile.display_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="title">{profile.display_name}</h1>
            <p className="muted mt-1">@{profile.user_id}</p>
            <ProfileFollowStats
              userId={profile.user_id}
              followerCount={followInfo.followerCount}
              followingCount={followInfo.followingCount}
            />
            {profile.bio && (
              <p className="mt-3 whitespace-pre-wrap text-sm">{profile.bio}</p>
            )}
            <div className="mt-4">
              <FollowButton
                targetProfileId={profile.id}
                initialFollowing={followInfo.isFollowing}
                isLoggedIn={!!user}
              />
            </div>
          </div>
        </div>

        <section className="section">
          {columnsError && (
            <p className="alert-error mt-4">コラムの取得に失敗しました。</p>
          )}

          {!columnsError && (!columns || columns.length === 0) && (
            <div className="empty mt-4">
              <p className="muted">まだコラムがありません</p>
            </div>
          )}

          {!columnsError && columns && columns.length > 0 && (
            <ul className="column-feed-list">
              {(columns as ColumnListItemType[]).map((column) => (
                <li key={column.id}>
                  <ColumnListItem column={column} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
