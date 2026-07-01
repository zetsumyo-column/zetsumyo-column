import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions/auth";
import { MyColumnListEmpty, MyColumnListItem } from "@/components/column/my-column-list-item";
import { SiteHeader } from "@/components/layout/site-header";
import { getMyColumns } from "@/lib/column/queries";
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

  const [{ data: profile, error: profileError }, { data: columns, error: columnsError }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      getMyColumns(user.id),
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
            {profile.bio && (
              <p className="mt-3 whitespace-pre-wrap text-sm">{profile.bio}</p>
            )}
            <Link href="/settings" className="link mt-3 inline-block">
              設定
            </Link>
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
          <h2 className="subtitle">投稿したコラム</h2>

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
