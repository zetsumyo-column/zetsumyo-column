import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { signOut } from "@/app/actions/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function MypagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-sm text-zinc-500">
          プロフィールの取得に失敗しました。再度ログインしてください。
        </p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          {profile.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">マイページ</h1>
            <p className="mt-2 text-sm text-zinc-500">
              プロフィールを設定してください
            </p>
          </div>
        </div>

        <ProfileForm profile={profile} />

        <div className="mt-8 flex flex-col items-center gap-4">
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              ログアウト
            </button>
          </form>
          <Link
            href="/columns"
            className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            コラム一覧
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
