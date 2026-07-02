import Link from "next/link";

import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { formatDate } from "@/lib/format-date";
import type { ColumnListItem } from "@/types/database";

type MyColumnListItemProps = {
  column: ColumnListItem;
};

export function MyColumnListItem({ column }: MyColumnListItemProps) {
  const plainTextLength = column.plain_text_length;
  const isDraft = column.status === "draft";
  const href = isDraft ? `/columns/${column.id}/edit` : `/columns/${column.id}`;

  return (
    <li className="column-feed-item">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={href}
            className="flex items-center gap-2 text-base font-medium"
          >
            <span className="truncate">{column.title}</span>
            {isDraft && <span className="badge shrink-0">下書き</span>}
          </Link>
          <p className="hint mt-2">
            <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
            <span className="mx-1.5">·</span>
            <span>{plainTextLength}文字</span>
          </p>
        </div>
        {isDraft && <DeleteColumnButton columnId={column.id} />}
      </div>
    </li>
  );
}

type MyColumnListEmptyProps = {
  className?: string;
};

export function MyColumnListEmpty({ className }: MyColumnListEmptyProps) {
  return (
    <div className={className ? `empty muted ${className}` : "empty muted"}>
      まだコラムがありません
      <Link href="/columns/new" className="link mt-3 inline-block">
        コラムを書く
      </Link>
    </div>
  );
}
