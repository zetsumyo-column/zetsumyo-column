import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ColumnArticleFooter } from "@/components/column/column-article-footer";
import { ColumnContent } from "@/components/column/column-content";
import { ColumnTitle } from "@/components/column/column-title";
import { ColumnTypographyFab } from "@/components/column/column-typography-fab";
import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { getPlainTextLength } from "@/lib/column/content";
import { getColumnById } from "@/lib/column/queries";
import { getColumnLikeInfo } from "@/lib/column/likes";
import { getFollowInfo } from "@/lib/profile/follows";
import { getAuthUser } from "@/lib/supabase/auth";

type ColumnPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ColumnPageProps): Promise<Metadata> {
  const { id } = await params;
  const column = await getColumnById(id);

  if (!column) {
    return { title: "コラムが見つかりません" };
  }

  return { title: column.title };
}

export default async function ColumnPage({ params }: ColumnPageProps) {
  const { id } = await params;
  const [{ user }, column] = await Promise.all([getAuthUser(), getColumnById(id)]);

  if (!column) {
    notFound();
  }

  const isOwner = user?.id === column.author_id;
  const isDraft = column.status === "draft";

  if (isDraft && !isOwner) {
    notFound();
  }

  const { profiles: author } = column;
  const plainTextLength = getPlainTextLength(column.content);
  const [likeInfo, followInfo] = await Promise.all([
    !isDraft ? getColumnLikeInfo(column.id, user?.id) : Promise.resolve(null),
    !isOwner ? getFollowInfo(column.author_id, user?.id) : Promise.resolve(null),
  ]);

  return (
    <>
      <div className="page">
        {isDraft && (
          <div className="draft-banner text-sm">
            <span>このコラムは下書きです</span>
            <div className="flex items-center gap-4">
              <Link href={`/columns/${column.id}/edit`} className="link">
                編集する
              </Link>
              <DeleteColumnButton columnId={column.id} />
            </div>
          </div>
        )}

        <article className="column-article">
          <ColumnTitle>{column.title}</ColumnTitle>
          <ColumnContent content={column.content} />

          <ColumnArticleFooter
            author={author}
            authorId={column.author_id}
            columnId={column.id}
            createdAt={column.created_at}
            plainTextLength={plainTextLength}
            isDraft={isDraft}
            isLoggedIn={!!user}
            isOwner={isOwner}
            viewCount={column.view_count ?? 0}
            recordView={!isDraft && !isOwner}
            likeCount={likeInfo?.count}
            liked={likeInfo?.liked}
            isFollowing={followInfo?.isFollowing}
          />
        </article>
      </div>
      <ColumnTypographyFab />
    </>
  );
}
