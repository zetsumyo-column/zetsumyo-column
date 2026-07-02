import Link from "next/link";

import { getFollowersPath, getFollowingPath } from "@/lib/profile/paths";

type ProfileFollowStatsProps = {
  userId: string;
  followerCount: number;
  followingCount: number;
};

export function ProfileFollowStats({
  userId,
  followerCount,
  followingCount,
}: ProfileFollowStatsProps) {
  return (
    <div className="profile-follow-stats">
      <Link href={getFollowersPath(userId)} className="profile-follow-stat">
        <span className="profile-follow-stat-value">{followerCount}</span>
        <span className="profile-follow-stat-label">フォロワー</span>
      </Link>
      <Link href={getFollowingPath(userId)} className="profile-follow-stat">
        <span className="profile-follow-stat-value">{followingCount}</span>
        <span className="profile-follow-stat-label">フォロー中</span>
      </Link>
    </div>
  );
}
