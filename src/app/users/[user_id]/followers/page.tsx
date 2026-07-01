import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProfileListEmpty, ProfileListItem } from "@/components/profile/profile-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { BackLink } from "@/components/ui/back-link";
import {
  getFollowers,
  getProfileHref,
} from "@/lib/profile/follows";
import { getProfileByUserId } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

type FollowersPageProps = {
  params: Promise<{ user_id: string }>;
};

export async function generateMetadata({
  params,
}: FollowersPageProps): Promise<Metadata> {
  const { user_id } = await params;
  const { data: profile } = await getProfileByUserId(user_id);

  if (!profile) {
    return { title: "ユーザーが見つかりません" };
  }

  return { title: `${profile.display_name}のフォロワー` };
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { user_id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  const { data: follows, error: followsError } = await getFollowers(profile.id);
  const backHref = getProfileHref(profile.user_id, user?.id, profile.id);
  const isOwnProfile = user?.id === profile.id;

  return (
    <>
      <SiteHeader />
      <div className="page">
        <div className="mb-8">
          <h1 className="title">フォロワー</h1>
          <p className="muted mt-2">
            {isOwnProfile ? "あなた" : profile.display_name}のフォロワー
          </p>
        </div>

        {followsError && (
          <p className="alert-error">フォロワーの取得に失敗しました。</p>
        )}

        {!followsError && (!follows || follows.length === 0) && (
          <ProfileListEmpty message="まだフォロワーがいません" />
        )}

        {!followsError && follows && follows.length > 0 && (
          <ul className="list mt-0">
            {follows.map((follow) => (
                <li key={follow.profiles.id}>
                  <ProfileListItem
                    profile={follow.profiles}
                    href={getProfileHref(
                      follow.profiles.user_id,
                      user?.id,
                      follow.profiles.id,
                    )}
                  />
                </li>
              ))}
          </ul>
        )}

        <p className="mt-8 text-center">
          <BackLink href={backHref}>
            {isOwnProfile ? "マイページに戻る" : "プロフィールに戻る"}
          </BackLink>
        </p>
      </div>
    </>
  );
}
