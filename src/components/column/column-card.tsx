import Image from "next/image";
import Link from "next/link";

import type { ColumnWithAuthor } from "@/types/database";

type ColumnCardProps = {
  column: ColumnWithAuthor;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ColumnCard({ column }: ColumnCardProps) {
  const { profiles: author } = column;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-3">
        {author.avatar_url ? (
          <Image
            src={author.avatar_url}
            alt={author.display_name}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {author.display_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{author.display_name}</p>
          <p className="truncate text-xs text-zinc-500">@{author.user_id}</p>
        </div>
        <time className="shrink-0 text-xs text-zinc-400">
          {formatDate(column.created_at)}
        </time>
      </div>

      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {column.content}
      </p>

      <p className="mt-3 text-xs text-zinc-400">
        {column.content.length} / {column.char_limit} 文字
      </p>
    </article>
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
