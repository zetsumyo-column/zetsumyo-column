import Link from "next/link";

import type { ColumnListItem } from "@/types/database";

type ColumnListItemProps = {
  column: ColumnListItem;
};

export function ColumnListItem({ column }: ColumnListItemProps) {
  return (
    <Link
      href={`/columns/${column.id}`}
      className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
    >
      {column.title}
    </Link>
  );
}

export function ColumnListEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
      <p className="text-sm text-zinc-500">まだコラムがありません</p>
      <Link
        href="/columns/new"
        className="mt-3 inline-block text-sm font-medium underline"
      >
        最初のコラムを投稿する
      </Link>
    </div>
  );
}
