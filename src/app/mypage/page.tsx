import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cog6ToothIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { signOut } from "@/app/actions/auth";
import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfileFollowStats } from "@/components/profile/profile-follow-stats";
import { getMyColumns } from "@/lib/column/queries";
import { getFollowInfo } from "@/lib/profile/follows";
import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem as ColumnListItemType } from "@/types/database";

export default async function MypagePage() {
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
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="avatar h-20 w-20 text-2xl">{profile.display_name.charAt(0)}</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="title">{profile.display_name}</h1>
            <p className="muted mt-1">@{profile.user_id}</p>
            <ProfileFollowStats
              userId={profile.user_id}
              followerCount={followInfo.followerCount}
              followingCount={followInfo.followingCount}
            />
            {profile.bio && (
              <p className="mt-3 whitespace-pre-wrap text-sm">{profile.bio}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/columns/new" className="btn inline-flex items-center gap-1.5">
                <PencilSquareIcon className="h-4 w-4" aria-hidden />
                投稿
              </Link>
              <Link href="/settings" className="link inline-flex items-center gap-1.5">
                <Cog6ToothIcon className="h-4 w-4" aria-hidden />
                設定
              </Link>
            </div>
          </div>
        </div>

        {draftColumns.length > 0 && (
          <section className="section">
            <h2 className="subtitle">下書き</h2>
            <ul className="list">
              {draftColumns.map((column) => (
                <li key={column.id}>
                  <MyColumnListItem column={column} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="section">
          {columnsError && (
            <p className="alert-error mt-4">コラムの取得に失敗しました。</p>
          )}

          {!columnsError && publishedColumns.length === 0 && (
            <div className="mt-4">
              <MyColumnListEmpty />
            </div>
          )}

          {!columnsError && publishedColumns.length > 0 && (
            <ul className="list">
              {publishedColumns.map((column) => (
                <li key={column.id}>
                  <MyColumnListItem column={column} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="divider">
          <form action={signOut}>
            <button type="submit" className="link">
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
