import { notFound, redirect } from "next/navigation";

import { ColumnListItem } from "@/components/column/column-list-item";
import { getLikedColumnsByUser } from "@/lib/column/queries";
import { getProfilePublishedPath } from "@/lib/profile/paths";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";
import type { ColumnListItemWithAuthor } from "@/types/database";

type LikesPageProps = {
  params: Promise<{ user_id: string }>;
};

export default async function LikesPage({ params }: LikesPageProps) {
  const { user_id } = await params;
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  if (!user || user.id !== profile.id) {
    redirect(getProfilePublishedPath(user_id));
  }

  const { data: columns, error } = await getLikedColumnsByUser(user.id);
  const likedColumns = (columns ?? []) as ColumnListItemWithAuthor[];

  return (
    <>
      {error && (
        <p className="alert-error">コラムの取得に失敗しました。</p>
      )}

      {!error && likedColumns.length === 0 && (
        <div className="empty muted">
          いいねしたコラムがここに表示されます
        </div>
      )}

      {!error && likedColumns.length > 0 && (
        <ul className="column-feed-list mt-0">
          {likedColumns.map((column) => (
            <ColumnListItem key={column.id} column={column} />
          ))}
        </ul>
      )}
    </>
  );
}
