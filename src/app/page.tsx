import { ColumnListEmpty, ColumnListItem } from "@/components/column/column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { getColumnList } from "@/lib/column/queries";
import type { ColumnListItemWithAuthor } from "@/types/database";

export default async function HomePage() {
  const { data: columns, error } = await getColumnList();

  return (
    <>
      <SiteHeader />
      <div className="page">
        {error && (
          <p className="alert-error">
            コラムの取得に失敗しました。Supabase で 002_columns.sql を実行済みか確認してください。
          </p>
        )}

        {!error && (!columns || columns.length === 0) && <ColumnListEmpty />}

        {!error && columns && columns.length > 0 && (
          <ul className="column-feed-list mt-0">
            {(columns as ColumnListItemWithAuthor[]).map((column) => (
              <ColumnListItem key={column.id} column={column} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
