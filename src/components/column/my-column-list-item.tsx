import Link from "next/link";

import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { getPlainTextLength } from "@/lib/column/content";
import type { ColumnListItem } from "@/types/database";

type MyColumnListItemProps = {
  column: ColumnListItem;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MyColumnListItem({ column }: MyColumnListItemProps) {
  const plainTextLength = getPlainTextLength(column.content);
  const isDraft = column.status === "draft";
  const href = isDraft ? `/columns/${column.id}/edit` : `/columns/${column.id}`;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={href} className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium leading-snug">{column.title}</p>
          {isDraft && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              下書き
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">
          <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
          <span className="mx-1.5">·</span>
          <span>{plainTextLength}文字</span>
        </p>
      </Link>
      <DeleteColumnButton columnId={column.id} />
    </div>
  );
}

export function MyColumnListEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
      <p className="text-sm text-zinc-500">まだコラムがありません</p>
      <Link
        href="/columns/new"
        className="mt-3 inline-block text-sm font-medium underline"
      >
        コラムを書く
      </Link>
    </div>
  );
}
