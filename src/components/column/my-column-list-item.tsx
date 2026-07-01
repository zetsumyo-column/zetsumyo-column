import Link from "next/link";

import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { getPlainTextLength } from "@/lib/column/content";
import { formatDate } from "@/lib/format-date";
import type { ColumnListItem } from "@/types/database";

type MyColumnListItemProps = {
  column: ColumnListItem;
};

export function MyColumnListItem({ column }: MyColumnListItemProps) {
  const plainTextLength = getPlainTextLength(column.content);
  const isDraft = column.status === "draft";
  const href = isDraft ? `/columns/${column.id}/edit` : `/columns/${column.id}`;

  return (
    <div className="card flex items-start gap-3">
      <Link href={href} className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{column.title}</p>
          {isDraft && <span className="badge">下書き</span>}
        </div>
        <p className="hint mt-1">
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
    <div className="empty">
      <p className="muted">まだコラムがありません</p>
      <Link href="/columns/new" className="link mt-3 inline-block">
        コラムを書く
      </Link>
    </div>
  );
}
