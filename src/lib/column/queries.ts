import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { ColumnListItem, ColumnWithAuthor } from "@/types/database";

export const getColumnById = cache(async (id: string): Promise<ColumnWithAuthor | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("columns")
    .select(
      "*, profiles!columns_author_id_fkey(user_id, display_name, avatar_url, bio)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ColumnWithAuthor;
});

export const getColumnList = cache(async () => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select(
      "id, title, created_at, plain_text_length, status, profiles!columns_author_id_fkey(user_id, display_name)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });
});

export const getMyColumns = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, title, created_at, plain_text_length, status")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });
});

export const getPublishedColumnsByAuthor = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, title, created_at, plain_text_length, status")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
});

export function sumPlainTextLength(
  columns: Pick<ColumnListItem, "plain_text_length">[],
): number {
  return columns.reduce((sum, column) => sum + column.plain_text_length, 0);
}
