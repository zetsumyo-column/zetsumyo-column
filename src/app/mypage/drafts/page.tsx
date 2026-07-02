import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { getMyDraftColumns } from "@/lib/column/queries";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

type MypageDraftsPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function MypageDraftsPage({ searchParams }: MypageDraftsPageProps) {
  const { error: pageError } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
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
            <MyColumnListItem key={column.id} column={column} />
          ))}
        </ul>
      )}
    </>
  );
}
