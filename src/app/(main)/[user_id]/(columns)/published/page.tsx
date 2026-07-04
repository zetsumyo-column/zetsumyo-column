import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { ColumnListItem } from "@/components/column/column-list-item";
import { ProfileListEmpty } from "@/components/profile/profile-list-item";
import { getColumnLikeCounts } from "@/lib/column/likes";
import { getPublishedColumnsByAuthor } from "@/lib/column/queries";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getAuthUser } from "@/lib/supabase/auth";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

type PublishedPageProps = {
  params: Promise<{ user_id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({
  params,
}: PublishedPageProps): Promise<Metadata> {
  const { user_id } = await params;
  const { data: profile } = await getProfileByUserId(user_id);

  if (!profile) {
    return { title: "ユーザーが見つかりません" };
  }

  return { title: profile.display_name };
}

export default async function PublishedPage({
  params,
  searchParams,
}: PublishedPageProps) {
  const { user_id } = await params;
  const { error: pageError } = await searchParams;
  const { user } = await getAuthUser();
  const { data: profile, error: profileError } = await getProfileByUserId(user_id);

  if (profileError || !profile) {
    notFound();
  }

  const isOwner = user?.id === profile.id;
  const { data: columns, error: columnsError } = await getPublishedColumnsByAuthor(profile.id);
  const publishedColumns = (columns ?? []) as ColumnListItemType[];
  const likeCounts = await getColumnLikeCounts(
    publishedColumns.map((column) => column.id),
  );

  if (isOwner) {
    return (
      <>
        {pageError && (
          <p className="alert-error">{decodeURIComponent(pageError)}</p>
        )}

        {columnsError && (
          <p className="alert-error">コラムの取得に失敗しました。</p>
        )}

        {!columnsError && publishedColumns.length === 0 && <MyColumnListEmpty />}

        {!columnsError && publishedColumns.length > 0 && (
          <ul className="column-feed-list mt-0">
            {publishedColumns.map((column) => (
              <MyColumnListItem
                key={column.id}
                column={column}
                profileUserId={user_id}
                likeCount={likeCounts.get(column.id) ?? 0}
              />
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <section className="section">
      {columnsError && (
        <p className="alert-error mt-4">コラムの取得に失敗しました。</p>
      )}

      {!columnsError && publishedColumns.length === 0 && (
        <ProfileListEmpty message="まだコラムがありません" className="mt-4" />
      )}

      {!columnsError && publishedColumns.length > 0 && (
        <ul className="column-feed-list">
          {publishedColumns.map((column) => (
            <ColumnListItem
              key={column.id}
              column={column}
              profileUserId={user_id}
              likeCount={likeCounts.get(column.id) ?? 0}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
