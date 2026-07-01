import { ColumnListEmpty, ColumnListItem } from "@/components/column/column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { getColumnList } from "@/lib/column/queries";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

export default async function HomePage() {
  const { data: columns, error } = await getColumnList();

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            コラムの取得に失敗しました。Supabase で 002_columns.sql を実行済みか確認してください。
          </p>
        )}

        {!error && (!columns || columns.length === 0) && <ColumnListEmpty />}

        {!error && columns && columns.length > 0 && (
          <ul className="flex flex-col gap-2">
            {(columns as ColumnListItemType[]).map((column) => (
              <li key={column.id}>
                <ColumnListItem column={column} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
