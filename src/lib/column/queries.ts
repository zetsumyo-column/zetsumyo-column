import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getColumnList = cache(async () => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select(
      "id, title, created_at, content, status, profiles!columns_author_id_fkey(user_id, display_name)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });
});

export const getMyColumns = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, title, created_at, content, status")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });
});

export const getPublishedColumnsByAuthor = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, title, created_at, content, status")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
});
