"use server";

import { revalidatePath } from "next/cache";

import {
  validateDisplayName,
  validateUserId,
} from "@/lib/validation/profile";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const userId = String(formData.get("user_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();

  const userIdError = validateUserId(userId);
  if (userIdError) {
    return { error: userIdError };
  }

  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return { error: displayNameError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      user_id: userId,
      display_name: displayName,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "この ID はすでに使用されています" };
    }
    return { error: "保存に失敗しました。もう一度お試しください" };
  }

  revalidatePath("/mypage");
  return { success: true };
}
