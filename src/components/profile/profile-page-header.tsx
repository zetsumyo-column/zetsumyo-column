import Image from "next/image";

import { ProfileSnsLinks } from "@/components/profile/profile-sns-links";
import { ProfileFollowStats } from "@/components/profile/profile-follow-stats";
import { getAvatarInitial } from "@/lib/profile/avatar";
import type { ProfileSnsFields } from "@/lib/profile/sns";
import type { Profile } from "@/types/database";

type ProfilePageHeaderProps = {
  profile: Pick<Profile, "user_id" | "display_name" | "avatar_url" | "bio"> &
    ProfileSnsFields;
  columnCount: number;
  totalCharacterCount: number;
  followerCount: number;
  followingCount: number;
  actions?: React.ReactNode;
};

export function ProfilePageHeader({
  profile,
  columnCount,
  totalCharacterCount,
  followerCount,
  followingCount,
  actions,
}: ProfilePageHeaderProps) {
  return (
    <header className="profile-header">
      <div className="profile-header-intro">
        <div className="profile-header-avatar">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              width={72}
              height={72}
              className="rounded-full"
            />
          ) : (
            <div className="avatar profile-header-avatar-fallback">
              {getAvatarInitial(profile.display_name, profile.user_id)}
            </div>
          )}
        </div>
        <div className="profile-header-identity">
          <h1 className="title">{profile.display_name}</h1>
          <p className="muted mt-0.5">@{profile.user_id}</p>
        </div>
      </div>

      <div className="profile-header-body">
        <ProfileFollowStats
          userId={profile.user_id}
          columnCount={columnCount}
          totalCharacterCount={totalCharacterCount}
          followerCount={followerCount}
          followingCount={followingCount}
        />

        {profile.bio && (
          <p className="profile-header-bio whitespace-pre-wrap">{profile.bio}</p>
        )}

        <ProfileSnsLinks profile={profile} />

        {actions && <div className="profile-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
