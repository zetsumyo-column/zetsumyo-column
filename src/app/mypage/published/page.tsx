import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { getPublishedColumnsByAuthor } from "@/lib/column/queries";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

export default async function MypagePublishedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: columns, error: columnsError } = await getPublishedColumnsByAuthor(user.id);
  const publishedColumns = (columns ?? []) as ColumnListItemType[];

  return (
    <>
      {columnsError && (
        <p className="alert-error">コラムの取得に失敗しました。</p>
      )}

      {!columnsError && publishedColumns.length === 0 && (
        <MyColumnListEmpty />
      )}

      {!columnsError && publishedColumns.length > 0 && (
        <ul className="column-feed-list mt-0">
          {publishedColumns.map((column) => (
            <MyColumnListItem key={column.id} column={column} />
          ))}
        </ul>
      )}
    </>
  );
}
