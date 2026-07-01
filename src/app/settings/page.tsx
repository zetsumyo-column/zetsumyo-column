import { redirect } from "next/navigation";

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
        <div className="auth-page">
          <p className="muted">プロフィールの取得に失敗しました。再度ログインしてください。</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="page">
        <div className="page-narrow">
          <div className="mb-8">
            <h1 className="title">設定</h1>
            <p className="muted mt-2">
              ID・ユーザー名・自己紹介文・表示設定を変更できます
            </p>
          </div>

          <div className="mb-8 stack">
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
