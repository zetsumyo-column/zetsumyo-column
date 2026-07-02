import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProfileListEmpty, ProfileListItem } from "@/components/profile/profile-list-item";
import { BackLink } from "@/components/ui/back-link";
import {
  getFollowers,
  getProfileHref,
} from "@/lib/profile/follows";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";

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
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  const { data: follows, error: followsError } = await getFollowers(profile.id);
  const backHref = getProfileHref(profile.user_id, user?.id, profile.id);
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="page">
      <h1 className="title mb-8">フォロワー</h1>

      {followsError && (
        <p className="alert-error">フォロワーの取得に失敗しました。</p>
      )}

      {!followsError && (!follows || follows.length === 0) && (
        <ProfileListEmpty message="まだフォロワーがいません" />
      )}

      {!followsError && follows && follows.length > 0 && (
        <ul className="list mt-0">
          {follows.map((follow) => (
            <ProfileListItem
              key={follow.profiles.id}
              profile={follow.profiles}
              href={getProfileHref(
                follow.profiles.user_id,
                user?.id,
                follow.profiles.id,
              )}
            />
          ))}
        </ul>
      )}

      {!isOwnProfile && (
        <BackLink href={backHref} className="mt-8 block text-center">
          プロフィールに戻る
        </BackLink>
      )}
    </div>
  );
}
