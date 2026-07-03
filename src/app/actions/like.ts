"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequiredAuthUser } from "@/lib/supabase/auth";

export type ToggleLikeResult = { liked: boolean } | { error: string };

export async function toggleLike(columnId: string): Promise<ToggleLikeResult> {
  const user = await getRequiredAuthUser();
  const supabase = await createClient();

  const { data: column, error: columnError } = await supabase
    .from("columns")
    .select("id, status")
    .eq("id", columnId)
    .maybeSingle();

  if (columnError || !column || column.status !== "published") {
    return { error: "いいねできないコラムです" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("column_likes")
    .select("id")
    .eq("column_id", columnId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return { error: "いいねの取得に失敗しました" };
  }

  if (existing) {
    const { error } = await supabase
      .from("column_likes")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: "いいねの解除に失敗しました" };
    }

    return { liked: false };
  }

  const { error } = await supabase.from("column_likes").insert({
    column_id: columnId,
    user_id: user.id,
  });

  if (error) {
    return { error: "いいねに失敗しました" };
  }

  return { liked: true };
}
