"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrCreateViewerSessionKey } from "@/lib/column/viewer-session";

export type RecordColumnViewResult =
  | { viewCount: number }
  | { error: string };

export async function recordColumnView(
  columnId: string,
): Promise<RecordColumnViewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: column, error: columnError } = await supabase
    .from("columns")
    .select("author_id, status, view_count")
    .eq("id", columnId)
    .maybeSingle();

  if (columnError || !column || column.status !== "published") {
    return { viewCount: 0 };
  }

  if (user?.id === column.author_id) {
    return { viewCount: column.view_count ?? 0 };
  }

  const viewerKey = await getOrCreateViewerSessionKey();

  const { data, error } = await supabase.rpc("record_column_view", {
    p_column_id: columnId,
    p_viewer_key: viewerKey,
  });

  if (error) {
    console.error("record column view error:", error);
    return { viewCount: column.view_count ?? 0 };
  }

  return { viewCount: typeof data === "number" ? data : (column.view_count ?? 0) };
}
