import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { SettingsPageShell } from "@/components/settings/settings-page-shell";
import { createClient } from "@/lib/supabase/server";

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
    <SettingsPageShell title="プロフィール">
      <ProfileForm profile={profile} />
    </SettingsPageShell>
  );
}
