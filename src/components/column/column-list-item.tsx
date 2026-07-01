import Link from "next/link";

import { getPlainTextLength } from "@/lib/column/content";
import type { ColumnListItem } from "@/types/database";

type ColumnListItemProps = {
  column: ColumnListItem;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ColumnListItem({ column }: ColumnListItemProps) {
  const plainTextLength = getPlainTextLength(column.content);

  return (
    <Link
      href={`/columns/${column.id}`}
      className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
    >
      <p className="text-sm font-medium leading-snug">{column.title}</p>
      <p className="mt-1.5 text-xs text-zinc-500">
        <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
        <span className="mx-1.5">·</span>
        <span>{plainTextLength}文字</span>
      </p>
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
