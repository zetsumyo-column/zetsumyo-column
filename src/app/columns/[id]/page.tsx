import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ColumnContent } from "@/components/column/column-content";
import { ColumnLikeButton } from "@/components/column/column-like-button";
import { ColumnTitle } from "@/components/column/column-title";
import { SiteHeader } from "@/components/layout/site-header";
import { getPlainTextLength } from "@/lib/column/content";
import { getColumnLikeInfo } from "@/lib/column/likes";
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
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
  const likeInfo = !isDraft
    ? await getColumnLikeInfo(column.id, user?.id)
    : null;

  return (
    <>
      <SiteHeader />
      <div className="page">
        {isDraft && (
          <div className="draft-banner">
            <p className="text-sm">このコラムは下書きです</p>
            <Link href={`/columns/${column.id}/edit`} className="link">
              編集する
            </Link>
          </div>
        )}

        <article className="column-article">
          <div className="column-main">
            <ColumnTitle>{column.title}</ColumnTitle>
            <ColumnContent content={column.content} />
          </div>

          <div className="flex items-center gap-3">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.display_name}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="avatar h-9 w-9 text-xs">
                {author.display_name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{author.display_name}</p>
              <p className="hint truncate">@{author.user_id}</p>
            </div>
            <time className="hint shrink-0">{formatDate(column.created_at)}</time>
          </div>

          {!isDraft && likeInfo && (
            <ColumnLikeButton
              columnId={column.id}
              initialCount={likeInfo.count}
              initialLiked={likeInfo.liked}
              isLoggedIn={!!user}
            />
          )}

          <p className="hint">
            {plainTextLength}文字（{CONTENT_MIN_LENGTH}〜{CONTENT_MAX_LENGTH}文字）
          </p>
        </article>
      </div>
    </>
  );
}
