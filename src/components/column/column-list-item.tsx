import Link from "next/link";

import { getPlainTextLength } from "@/lib/column/content";
import { formatDate } from "@/lib/format-date";
import type { ColumnListItem, ColumnListItemWithAuthor } from "@/types/database";

type ColumnListItemProps = {
  column: ColumnListItem | ColumnListItemWithAuthor;
};

function hasAuthor(
  column: ColumnListItem | ColumnListItemWithAuthor,
): column is ColumnListItemWithAuthor {
  return "profiles" in column && column.profiles != null;
}

export function ColumnListItem({ column }: ColumnListItemProps) {
  const plainTextLength = getPlainTextLength(column.content);

  if (!hasAuthor(column)) {
    return (
      <li className="column-feed-item">
        <Link href={`/columns/${column.id}`} className="block text-base font-medium">
          {column.title}
        </Link>
        <p className="hint mt-2">
          <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
          <span className="mx-1.5">·</span>
          <span>{plainTextLength}文字</span>
        </p>
      </li>
    );
  }

  const { profiles: author } = column;

  return (
    <li className="column-feed-item">
      <Link href={`/columns/${column.id}`} className="block text-base font-medium">
        {column.title}
      </Link>
      <p className="hint mt-2">
        <time dateTime={column.created_at}>{formatDate(column.created_at)}</time>
        <span className="mx-1.5">·</span>
        <span>{plainTextLength}文字</span>
        <span className="mx-1.5">·</span>
        <Link href={`/users/${author.user_id}`}>{author.display_name}</Link>
      </p>
    </li>
  );
}

export function ColumnListEmpty() {
  return (
    <div className="empty muted">
      まだコラムがありません
      <Link href="/columns/new" className="link mt-3 inline-block">
        最初のコラムを投稿する
      </Link>
    </div>
  );
}
