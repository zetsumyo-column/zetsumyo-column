type ProfileFollowStatsProps = {
  followerCount: number;
  followingCount: number;
};

export function ProfileFollowStats({
  followerCount,
  followingCount,
}: ProfileFollowStatsProps) {
  return (
    <p className="hint mt-2">
      <span>{followerCount} フォロワー</span>
      <span className="mx-1.5">·</span>
      <span>{followingCount} フォロー中</span>
    </p>
  );
}
