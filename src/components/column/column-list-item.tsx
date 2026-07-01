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
    <Link href={`/columns/${column.id}`} className="card-link">
      <p className="text-sm font-medium">{column.title}</p>
      <p className="hint mt-1">
        <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
        <span className="mx-1.5">·</span>
        <span>{plainTextLength}文字</span>
      </p>
    </Link>
  );
}

export function ColumnListEmpty() {
  return (
    <div className="empty">
      <p className="muted">まだコラムがありません</p>
      <Link href="/columns/new" className="link mt-3 inline-block">
        最初のコラムを投稿する
      </Link>
    </div>
  );
}
