import Link from "next/link";

import { ColumnListEmpty, ColumnListItem } from "@/components/column/column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

export default async function ColumnsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: columns, error } = await supabase
    .from("columns")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">コラム一覧</h1>
            <p className="mt-1 text-sm text-zinc-500">
              文字数制限付きのコラムが並びます
            </p>
          </div>
          {user && (
            <Link
              href="/columns/new"
              className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              投稿する
            </Link>
          )}
        </div>

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
