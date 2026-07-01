"use server";

import { revalidatePath } from "next/cache";

import {
  validateBio,
  validateDisplayName,
  validateUserId,
} from "@/lib/validation/profile";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  warning?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const userId = String(formData.get("user_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const userIdError = validateUserId(userId);
  if (userIdError) {
    return { error: userIdError };
  }

  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return { error: displayNameError };
  }

  const bioError = validateBio(bio);
  if (bioError) {
    return { error: bioError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  const updatePayload = {
    user_id: userId,
    display_name: displayName,
    bio: bio.length > 0 ? bio : null,
  };

  let { error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", user.id);

  if (
    error &&
    (error.code === "PGRST204" ||
      error.code === "42703" ||
      error.message?.includes("bio"))
  ) {
    const bioProvided = bio.length > 0;
    ({ error } = await supabase
      .from("profiles")
      .update({
        user_id: userId,
        display_name: displayName,
      })
      .eq("id", user.id));

    if (!error) {
      revalidatePath("/mypage");
      revalidatePath("/settings");
      if (bioProvided) {
        return {
          warning:
            "IDとユーザー名は保存しました。自己紹介文を保存するには Supabase で 006_profiles_bio.sql を実行してください",
          success: true,
        };
      }
      return { success: true };
    }
  }

  if (error) {
    if (error.code === "23505") {
      return { error: "この ID はすでに使用されています" };
    }
    return { error: "保存に失敗しました。もう一度お試しください" };
  }

  revalidatePath("/mypage");
  revalidatePath("/settings");
  return { success: true };
}
