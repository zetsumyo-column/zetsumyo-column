import Link from "next/link";

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
      <Link href={`/users/${userId}/followers`} className="profile-follow-stat">
        <span className="profile-follow-stat-value">{followerCount}</span>
        <span className="profile-follow-stat-label">フォロワー</span>
      </Link>
      <Link href={`/users/${userId}/following`} className="profile-follow-stat">
        <span className="profile-follow-stat-value">{followingCount}</span>
        <span className="profile-follow-stat-label">フォロー中</span>
      </Link>
    </div>
  );
}
