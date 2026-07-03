import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ColumnListItem } from "@/components/column/column-list-item";
import { getFollowingColumnList } from "@/lib/column/queries";
import { getFollowingPath, getProfilePublishedPath } from "@/lib/profile/paths";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";
import type { ColumnListItemWithAuthor } from "@/types/database";

type FeedPageProps = {
  params: Promise<{ user_id: string }>;
};

export default async function FeedPage({ params }: FeedPageProps) {
  const { user_id } = await params;
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  if (!user || user.id !== profile.id) {
    redirect(getProfilePublishedPath(user_id));
  }

  const { data: columns, error } = await getFollowingColumnList(user.id);
  const followingColumns = (columns ?? []) as ColumnListItemWithAuthor[];

  return (
    <>
      {error && (
        <p className="alert-error">コラムの取得に失敗しました。</p>
      )}

      {!error && followingColumns.length === 0 && (
        <div className="empty muted">
          フォローしているユーザーのコラムがここに表示されます
          <Link href={getFollowingPath(user_id)} className="link mt-3 inline-block">
            フォロー中のユーザーを見る
          </Link>
        </div>
      )}

      {!error && followingColumns.length > 0 && (
        <ul className="column-feed-list mt-0">
          {followingColumns.map((column) => (
            <ColumnListItem key={column.id} column={column} />
          ))}
        </ul>
      )}
    </>
  );
}
