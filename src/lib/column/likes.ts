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

export async function getColumnLikeCounts(
  columnIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  for (const columnId of columnIds) {
    counts.set(columnId, 0);
  }

  if (columnIds.length === 0) {
    return counts;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("column_likes")
    .select("column_id")
    .in("column_id", columnIds);

  if (error) {
    console.error("column like counts error:", error);
    return counts;
  }

  for (const row of data ?? []) {
    counts.set(row.column_id, (counts.get(row.column_id) ?? 0) + 1);
  }

  return counts;
}
