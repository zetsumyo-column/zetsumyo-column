import Image from "next/image";
import Link from "next/link";

import { getAvatarInitial } from "@/lib/profile/avatar";
import type { FollowProfile } from "@/lib/profile/follows";

type ProfileListItemProps = {
  profile: FollowProfile;
  href: string;
};

export function ProfileListItem({ profile, href }: ProfileListItemProps) {
  return (
    <Link href={href} className="card-link flex items-center gap-3">
      {profile.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt={profile.display_name}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="avatar h-10 w-10 text-sm">
          {getAvatarInitial(profile.display_name, profile.user_id)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{profile.display_name}</p>
        <p className="hint truncate">@{profile.user_id}</p>
      </div>
    </Link>
  );
}

export function ProfileListEmpty({ message }: { message: string }) {
  return (
    <div className="empty">
      <p className="muted">{message}</p>
    </div>
  );
}
