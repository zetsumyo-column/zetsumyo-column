import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

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
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <p className="text-sm text-zinc-500">
            プロフィールの取得に失敗しました。再度ログインしてください。
          </p>
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
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {profile.display_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.display_name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">@{profile.user_id}</p>
            {profile.bio && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {profile.bio}
              </p>
            )}
            <Link
              href="/settings"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <Cog6ToothIcon className="h-4 w-4" aria-hidden />
              設定
            </Link>
          </div>
        </div>

        {draftColumns.length > 0 && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <DocumentTextIcon className="h-5 w-5" aria-hidden />
              下書き
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {draftColumns.map((column) => (
                <li key={column.id}>
                  <MyColumnListItem column={column} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <QueueListIcon className="h-5 w-5" aria-hidden />
            投稿したコラム
          </h2>

          {columnsError && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              コラムの取得に失敗しました。
            </p>
          )}

          {!columnsError && publishedColumns.length === 0 && (
            <div className="mt-4">
              <MyColumnListEmpty />
            </div>
          )}

          {!columnsError && publishedColumns.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {publishedColumns.map((column) => (
                <li key={column.id}>
                  <MyColumnListItem column={column} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-10 flex justify-center border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden />
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
