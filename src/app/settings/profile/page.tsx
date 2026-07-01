import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { BackLink } from "@/components/ui/back-link";
import { getSettingsItem } from "@/lib/settings/items";
import { createClient } from "@/lib/supabase/server";

const settingsItem = getSettingsItem("/settings/profile")!;

export default async function SettingsProfilePage() {
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
      <div className="auth-page">
        <p className="muted">プロフィールの取得に失敗しました。再度ログインしてください。</p>
      </div>
    );
  }

  return (
    <div className="page">
        <SettingsPageHeader
          Icon={settingsItem.Icon}
          title={settingsItem.title}
          description="ID・ユーザー名・自己紹介文を変更できます"
        />

        <ProfileForm profile={profile} />

        <p className="mt-8 text-center">
          <BackLink href="/settings">設定に戻る</BackLink>
        </p>
    </div>
  );
}
