import { redirect } from "next/navigation";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import { ColumnTypographySetting } from "@/components/settings/column-typography-setting";
import { ProfileForm } from "@/components/profile/profile-form";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeSetting } from "@/components/theme/theme-setting";
import { BackLink } from "@/components/ui/back-link";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
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

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Cog6ToothIcon className="h-6 w-6" aria-hidden />
              設定
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              ID・ユーザー名・自己紹介文・表示設定を変更できます
            </p>
          </div>

          <div className="mb-8 space-y-8">
            <ThemeSetting />
            <ColumnTypographySetting />
          </div>

          <ProfileForm profile={profile} />

          <p className="mt-8 text-center">
            <BackLink href="/mypage">マイページに戻る</BackLink>
          </p>
        </div>
      </div>
    </>
  );
}
