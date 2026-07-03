"use server";

import { redirect } from "next/navigation";

import { deleteProfileAvatars } from "@/lib/profile/avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequiredAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(): Promise<void> {
  const user = await getRequiredAuthUser();
  const supabase = await createClient();

  await deleteProfileAvatars(supabase, user.id);

  const admin = createAdminClient();
  await deleteProfileAvatars(admin, user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("account delete error:", error);
    redirect(
      `/settings/account?error=${encodeURIComponent("アカウントの削除に失敗しました")}`,
    );
  }

  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}
