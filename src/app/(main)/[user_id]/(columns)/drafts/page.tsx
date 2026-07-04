import { notFound, redirect } from "next/navigation";

import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { getMyDraftColumns } from "@/lib/column/queries";
import { getProfilePublishedPath } from "@/lib/profile/paths";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

type DraftsPageProps = {
  params: Promise<{ user_id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function DraftsPage({ params, searchParams }: DraftsPageProps) {
  const { user_id } = await params;
  const { error: pageError } = await searchParams;
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  if (!user || user.id !== profile.id) {
    redirect(getProfilePublishedPath(user_id));
  }

  const { data: columns, error: columnsError } = await getMyDraftColumns(user.id);
  const draftColumns = (columns ?? []) as ColumnListItemType[];

  return (
    <>
      {pageError && (
        <p className="alert-error">{decodeURIComponent(pageError)}</p>
      )}

      {columnsError && (
        <p className="alert-error">コラムの取得に失敗しました。</p>
      )}

      {!columnsError && draftColumns.length === 0 && <MyColumnListEmpty />}

      {!columnsError && draftColumns.length > 0 && (
        <ul className="column-feed-list mt-0">
          {draftColumns.map((column) => (
            <MyColumnListItem key={column.id} column={column} profileUserId={user_id} />
          ))}
        </ul>
      )}
    </>
  );
}
