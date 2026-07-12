import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getAvatarExtension,
  validateAvatarFile,
} from "@/lib/validation/avatar";
import type { Database } from "@/types/database";

const AVATAR_BUCKET = "avatars";

export function getAvatarInitial(
  displayName?: string | null,
  fallback?: string | null,
): string {
  const name = displayName?.trim();
  if (name) {
    return name.charAt(0);
  }

  const alt = fallback?.trim();
  if (alt) {
    return alt.charAt(0);
  }

  return "?";
}

export async function uploadProfileAvatar(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<{ avatarUrl: string } | { error: string }> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const extension = getAvatarExtension(file.type);
  if (!extension) {
    return { error: "対応していない画像形式です" };
  }

  const path = `${userId}/avatar.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("avatar upload error:", uploadError);
    return {
      error:
        "プロフィール画像のアップロードに失敗しました。Supabase で 011_avatars_storage.sql を実行済みか確認してください",
    };
  }

  await deleteProfileAvatarsExcept(supabase, userId, path);

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  return {
    avatarUrl: `${publicUrl}?v=${Date.now()}`,
  };
}

export async function deleteProfileAvatars(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  await deleteProfileAvatarsExcept(supabase, userId);
}

async function deleteProfileAvatarsExcept(
  supabase: SupabaseClient<Database>,
  userId: string,
  keepPath?: string,
): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) {
    console.error("avatar list error:", listError);
    return;
  }

  if (!files?.length) {
    return;
  }

  const paths = files
    .map((file) => `${userId}/${file.name}`)
    .filter((path) => path !== keepPath);

  if (paths.length === 0) {
    return;
  }

  const { error: removeError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove(paths);

  if (removeError) {
    console.error("avatar delete error:", removeError);
  }
}
