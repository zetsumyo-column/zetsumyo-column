import Image from "next/image";

import { ProfileFollowStats } from "@/components/profile/profile-follow-stats";
import { getAvatarInitial } from "@/lib/profile/avatar";
import type { Profile } from "@/types/database";

type ProfilePageHeaderProps = {
  profile: Pick<Profile, "user_id" | "display_name" | "avatar_url" | "bio">;
  followerCount: number;
  followingCount: number;
  actions?: React.ReactNode;
};

export function ProfilePageHeader({
  profile,
  followerCount,
  followingCount,
  actions,
}: ProfilePageHeaderProps) {
  return (
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
            {getAvatarInitial(profile.display_name, profile.user_id)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="title">{profile.display_name}</h1>
        <p className="muted mt-1">@{profile.user_id}</p>
        <ProfileFollowStats
          userId={profile.user_id}
          followerCount={followerCount}
          followingCount={followingCount}
        />
        {profile.bio && (
          <p className="mt-3 whitespace-pre-wrap text-sm">{profile.bio}</p>
        )}
        {actions}
      </div>
    </div>
  );
}
