import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { ColumnContent } from "@/components/column/column-content";
import { SiteHeader } from "@/components/layout/site-header";
import { getPlainTextLength } from "@/lib/column/content";
import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
} from "@/lib/constants/column";
import { createClient } from "@/lib/supabase/server";
import type { ColumnWithAuthor } from "@/types/database";

type ColumnPageProps = {
  params: Promise<{ id: string }>;
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

async function getColumn(id: string): Promise<ColumnWithAuthor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("columns")
    .select(
      "*, profiles!columns_author_id_fkey(user_id, display_name, avatar_url)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ColumnWithAuthor;
}

export async function generateMetadata({
  params,
}: ColumnPageProps): Promise<Metadata> {
  const { id } = await params;
  const column = await getColumn(id);

  if (!column) {
    return { title: "コラムが見つかりません" };
  }

  return { title: column.title };
}

export default async function ColumnPage({ params }: ColumnPageProps) {
  const { id } = await params;
  const column = await getColumn(id);

  if (!column) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === column.author_id;
  const isDraft = column.status === "draft";

  if (isDraft && !isOwner) {
    notFound();
  }

  const { profiles: author } = column;
  const plainTextLength = getPlainTextLength(column.content);

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <p className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            コラム一覧に戻る
          </Link>
        </p>

        {isDraft && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              このコラムは下書きです
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/columns/${column.id}/edit`}
                className="text-sm font-medium text-amber-900 underline dark:text-amber-100"
              >
                編集する
              </Link>
              <DeleteColumnButton columnId={column.id} />
            </div>
          </div>
        )}

        <article>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight leading-snug">
              {column.title}
            </h1>
            {isOwner && !isDraft && (
              <DeleteColumnButton columnId={column.id} className="shrink-0 text-sm text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
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

          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <ColumnContent content={column.content} />
          </div>

          <p className="mt-6 text-xs text-zinc-400">
            {plainTextLength}文字（{CONTENT_MIN_LENGTH}〜{CONTENT_MAX_LENGTH}文字）
          </p>
        </article>
      </div>
    </>
  );
}
