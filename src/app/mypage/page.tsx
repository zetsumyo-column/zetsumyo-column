import { redirect } from "next/navigation";

import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { getMyColumns } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

type MypagePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function MypagePage({ searchParams }: MypagePageProps) {
  const { error: pageError } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile, error: profileError }, { data: columns, error: columnsError }, followInfo] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      getMyColumns(user.id),
      getFollowInfo(user.id),
    ]);

  if (profileError || !profile) {
    return (
      <>
        <SiteHeader />
        <div className="auth-page">
          <p className="muted">プロフィールの取得に失敗しました。再度ログインしてください。</p>
        </div>
      </>
    );
  }

  const allColumns = (columns ?? []) as ColumnListItemType[];
  const draftColumns = allColumns.filter((column) => column.status === "draft");
  const publishedColumns = allColumns.filter(
    (column) => column.status === "published",
  );

  return (
    <>
      <SiteHeader />
      <div className="page">
        <ProfilePageHeader
          profile={profile}
          followerCount={followInfo.followerCount}
          followingCount={followInfo.followingCount}
        />

        {pageError && (
          <p className="alert-error mt-6">{decodeURIComponent(pageError)}</p>
        )}

        {draftColumns.length > 0 && (
          <section className="section">
            <h2 className="subtitle">下書き</h2>
            <ul className="column-feed-list">
              {draftColumns.map((column) => (
                <MyColumnListItem key={column.id} column={column} />
              ))}
            </ul>
          </section>
        )}

        <section className="section">
          {columnsError && (
            <p className="alert-error mt-4">コラムの取得に失敗しました。</p>
          )}

          {!columnsError && publishedColumns.length === 0 && (
            <MyColumnListEmpty className="mt-4" />
          )}

          {!columnsError && publishedColumns.length > 0 && (
            <ul className="column-feed-list">
              {publishedColumns.map((column) => (
                <MyColumnListItem key={column.id} column={column} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
