"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getRequiredAuthUser } from "@/lib/supabase/auth";

export type ToggleFollowResult = { isFollowing: boolean } | { error: string };

export async function toggleFollow(
  targetProfileId: string,
): Promise<ToggleFollowResult> {
  const user = await getRequiredAuthUser();
  const supabase = await createClient();

  if (user.id === targetProfileId) {
    return { error: "自分自身をフォローすることはできません" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", targetProfileId)
    .maybeSingle();

  if (profileError || !profile) {
    return { error: "ユーザーが見つかりません" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetProfileId)
    .maybeSingle();

  if (fetchError) {
    return { error: "フォロー状態の取得に失敗しました" };
  }

  if (existing) {
    const { error } = await supabase
      .from("user_follows")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: "フォロー解除に失敗しました" };
    }

    revalidatePath("/mypage/following");
    return { isFollowing: false };
  }

  const { error } = await supabase.from("user_follows").insert({
    follower_id: user.id,
    following_id: targetProfileId,
  });

  if (error) {
    return { error: "フォローに失敗しました" };
  }

  revalidatePath("/mypage/following");
  return { isFollowing: true };
}
