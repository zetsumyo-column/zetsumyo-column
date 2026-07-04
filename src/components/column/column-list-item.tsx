import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { getColumnPath } from "@/lib/column/paths";
import { getProfilePath } from "@/lib/profile/paths";
import type { ColumnListItem, ColumnListItemWithAuthor } from "@/types/database";

type ColumnListItemProps = {
  column: ColumnListItem | ColumnListItemWithAuthor;
  profileUserId?: string;
};

function hasAuthor(
  column: ColumnListItem | ColumnListItemWithAuthor,
): column is ColumnListItemWithAuthor {
  return "profiles" in column && column.profiles != null;
}

export function ColumnListItem({ column, profileUserId }: ColumnListItemProps) {
  const plainTextLength = column.plain_text_length;

  if (!hasAuthor(column)) {
    const href = profileUserId
      ? getColumnPath(profileUserId, column.public_id)
      : "#";

    return (
      <li className="column-feed-item">
        <Link href={href} className="block text-base font-medium">
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
      <Link href={getColumnPath(author.user_id, column.public_id)} className="block text-base font-medium">
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
