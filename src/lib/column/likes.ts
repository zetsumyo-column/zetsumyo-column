import { createClient } from "@/lib/supabase/server";

export type ColumnLikeInfo = {
  count: number;
  liked: boolean;
};

export async function getColumnLikeInfo(
  columnId: string,
  userId?: string,
): Promise<ColumnLikeInfo> {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("column_likes")
    .select("*", { count: "exact", head: true })
    .eq("column_id", columnId);

  if (countError) {
    return { count: 0, liked: false };
  }

  if (!userId) {
    return { count: count ?? 0, liked: false };
  }

  const { data, error: likedError } = await supabase
    .from("column_likes")
    .select("id")
    .eq("column_id", columnId)
    .eq("user_id", userId)
    .maybeSingle();

  if (likedError) {
    return { count: count ?? 0, liked: false };
  }

  return { count: count ?? 0, liked: !!data };
}
