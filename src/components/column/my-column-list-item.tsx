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
    <article className="column-feed-item">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={href} className="block">
            <p className="flex items-center gap-2 text-base font-medium">
              <span className="truncate">{column.title}</span>
              {isDraft && <span className="badge shrink-0">下書き</span>}
            </p>
          </Link>
          <p className="hint mt-2">
            <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
            <span className="mx-1.5">·</span>
            <span>{plainTextLength}文字</span>
          </p>
        </div>
        <DeleteColumnButton columnId={column.id} />
      </div>
    </article>
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
