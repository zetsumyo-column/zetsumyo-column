import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { getProfilePath } from "@/lib/profile/paths";
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
  const plainTextLength = column.plain_text_length;

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
        <Link href={getProfilePath(author.user_id)}>{author.display_name}</Link>
      </p>
    </li>
  );
}

export function ColumnListEmpty({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <div className="empty muted">
      まだコラムがありません
      <Link
        href={isLoggedIn ? "/columns/new" : "/login?next=/columns/new"}
        className="link mt-3 inline-block"
      >
        最初のコラムを投稿する
      </Link>
    </div>
  );
}
