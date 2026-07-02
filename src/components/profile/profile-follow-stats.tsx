import Link from "next/link";

import { getFollowersPath, getFollowingPath } from "@/lib/profile/paths";

type ProfileFollowStatsProps = {
  userId: string;
  followerCount: number;
  followingCount: number;
  columnCount: number;
  totalCharacterCount: number;
};

export function ProfileFollowStats({
  userId,
  followerCount,
  followingCount,
  columnCount,
  totalCharacterCount,
}: ProfileFollowStatsProps) {
  return (
    <div className="profile-follow-stats">
      <div className="profile-follow-stat" aria-label={`コラム ${columnCount}件`}>
        <span className="profile-follow-stat-value">{columnCount}</span>
        <span className="profile-follow-stat-label">コラム</span>
      </div>
      <div
        className="profile-follow-stat"
        aria-label={`合計 ${totalCharacterCount.toLocaleString("ja-JP")}文字`}
      >
        <span className="profile-follow-stat-value">
          {totalCharacterCount.toLocaleString("ja-JP")}
        </span>
        <span className="profile-follow-stat-label">文字</span>
      </div>
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
