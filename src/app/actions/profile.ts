"use server";

import { revalidatePath } from "next/cache";

import {
  validateBio,
  validateDisplayName,
  validateUserId,
} from "@/lib/validation/profile";
import { validateAvatarFile } from "@/lib/validation/avatar";
import { uploadProfileAvatar } from "@/lib/profile/avatar";
import {
  getProfileDraftsPath,
  getProfileFeedPath,
  getProfilePath,
  getProfilePublishedPath,
} from "@/lib/profile/paths";
import {
  parseSnsUrlsFromFormData,
  snsUrlsToDbPayload,
  validateSnsUrls,
} from "@/lib/profile/sns";
import { getProfileSaveErrorMessage } from "@/lib/supabase/errors";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  warning?: string;
  success?: boolean;
};

function revalidateProfilePaths(userId: string) {
  revalidatePath("/mypage");
  revalidatePath("/settings");
  revalidatePath(getProfilePath(userId));
  revalidatePath(getProfilePublishedPath(userId));
  revalidatePath(getProfileDraftsPath(userId));
  revalidatePath(getProfileFeedPath(userId));
}

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

  const snsUrls = parseSnsUrlsFromFormData(formData);
  const snsError = validateSnsUrls(snsUrls);
  if (snsError) {
    return { error: snsError };
  }

  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    const avatarError = validateAvatarFile(avatarFile);
    if (avatarError) {
      return { error: avatarError };
    }
  }

  const supabase = await createClient();
  const { user } = await getAuthUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  let avatarUrl: string | undefined;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const uploadResult = await uploadProfileAvatar(supabase, user.id, avatarFile);
    if ("error" in uploadResult) {
      return { error: uploadResult.error };
    }
    avatarUrl = uploadResult.avatarUrl;
  }

  const updatePayload = {
    user_id: userId,
    display_name: displayName,
    bio: bio.length > 0 ? bio : null,
    ...snsUrlsToDbPayload(snsUrls),
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
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
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      })
      .eq("id", user.id));

    if (!error) {
      revalidateProfilePaths(userId);
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
    console.error("profile update error:", error);
    return { error: getProfileSaveErrorMessage(error) };
  }

  revalidateProfilePaths(userId);
  return { success: true };
}
