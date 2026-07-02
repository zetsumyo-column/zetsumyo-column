import { ColumnListEmpty, ColumnListItem } from "@/components/column/column-list-item";
import { getColumnList } from "@/lib/column/queries";
import { getAuthUser } from "@/lib/supabase/auth";
import type { ColumnListItemWithAuthor } from "@/types/database";

export default async function HomePage() {
  const [{ user }, { data: columns, error }] = await Promise.all([
    getAuthUser(),
    getColumnList(),
  ]);

  return (
    <div className="page">
      {error && (
        <p className="alert-error">
          コラムの取得に失敗しました。Supabase でマイグレーションを実行済みか確認してください。
        </p>
      )}

      {!error && (!columns || columns.length === 0) && (
        <ColumnListEmpty isLoggedIn={!!user} />
      )}

      {!error && columns && columns.length > 0 && (
        <ul className="column-feed-list mt-0">
          {(columns as ColumnListItemWithAuthor[]).map((column) => (
            <ColumnListItem key={column.id} column={column} />
          ))}
        </ul>
      )}
    </div>
  );
}
