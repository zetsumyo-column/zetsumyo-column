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
    <p className="hint mt-2">
      <Link href={`/users/${userId}/followers`} className="link">
        {followerCount} フォロワー
      </Link>
      <span className="mx-1.5">·</span>
      <Link href={`/users/${userId}/following`} className="link">
        {followingCount} フォロー中
      </Link>
    </p>
  );
}
