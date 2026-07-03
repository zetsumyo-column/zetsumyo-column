import Link from "next/link";

import { ColumnListItem } from "@/components/column/column-list-item";
import { getFollowingColumnList } from "@/lib/column/queries";
import { getFollowingPath } from "@/lib/profile/paths";
import { getRequiredAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItemWithAuthor } from "@/types/database";

export default async function MypageFollowingPage() {
  const user = await getRequiredAuthUser();

  const supabase = await createClient();
  const [{ data: profile }, { data: columns, error }] = await Promise.all([
    supabase.from("profiles").select("user_id").eq("id", user.id).single(),
    getFollowingColumnList(user.id),
  ]);

  const followingColumns = (columns ?? []) as ColumnListItemWithAuthor[];

  return (
    <>
      {error && (
        <p className="alert-error">
          コラムの取得に失敗しました。
        </p>
      )}

      {!error && followingColumns.length === 0 && (
        <div className="empty muted">
          フォローしているユーザーのコラムがここに表示されます
          {profile?.user_id && (
            <Link href={getFollowingPath(profile.user_id)} className="link mt-3 inline-block">
              フォロー中のユーザーを見る
            </Link>
          )}
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
