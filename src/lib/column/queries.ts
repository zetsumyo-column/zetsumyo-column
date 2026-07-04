import { cache } from "react";

import {
  isReservedColumnPublicId,
  isValidColumnPublicId,
} from "@/lib/column/public-id";
import { getProfileByUserId } from "@/lib/profile/queries";
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

export const getColumnByUserAndPublicId = cache(
  async (userId: string, publicId: string): Promise<ColumnWithAuthor | null> => {
    if (!isValidColumnPublicId(publicId) || isReservedColumnPublicId(publicId)) {
      return null;
    }

    const { data: profile, error: profileError } = await getProfileByUserId(userId);

    if (profileError || !profile) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("columns")
      .select(
        "*, profiles!columns_author_id_fkey(user_id, display_name, avatar_url, bio)",
      )
      .eq("author_id", profile.id)
      .eq("public_id", publicId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as ColumnWithAuthor;
  },
);

export const getColumnList = cache(async () => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select(
      "id, public_id, title, created_at, plain_text_length, status, profiles!columns_author_id_fkey(user_id, display_name)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });
});

export const getMyDraftColumns = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, public_id, title, created_at, plain_text_length, status")
    .eq("author_id", authorId)
    .eq("status", "draft")
    .order("created_at", { ascending: false });
});

export const getFollowingColumnList = cache(async (userId: string) => {
  const supabase = await createClient();

  const { data: follows, error: followsError } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followsError) {
    return { data: null, error: followsError };
  }

  const followingIds = follows?.map((follow) => follow.following_id) ?? [];

  if (followingIds.length === 0) {
    return { data: [], error: null };
  }

  return supabase
    .from("columns")
    .select(
      "id, public_id, title, created_at, plain_text_length, status, profiles!columns_author_id_fkey(user_id, display_name)",
    )
    .eq("status", "published")
    .in("author_id", followingIds)
    .order("created_at", { ascending: false });
});

export const getPublishedColumnStats = cache(async (authorId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("columns")
    .select("plain_text_length")
    .eq("author_id", authorId)
    .eq("status", "published");

  if (error) {
    return { columnCount: 0, totalCharacterCount: 0, error };
  }

  const rows = data ?? [];

  return {
    columnCount: rows.length,
    totalCharacterCount: sumPlainTextLength(rows),
    error: null,
  };
});

export const getPublishedColumnsByAuthor = cache(async (authorId: string) => {
  const supabase = await createClient();
  return supabase
    .from("columns")
    .select("id, public_id, title, created_at, plain_text_length, status")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
});

export const getLikedColumnsByUser = cache(async (userId: string) => {
  const supabase = await createClient();

  const { data: likes, error: likesError } = await supabase
    .from("column_likes")
    .select("column_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (likesError) {
    return { data: null, error: likesError };
  }

  if (!likes?.length) {
    return { data: [], error: null };
  }

  const columnIds = likes.map((like) => like.column_id);

  const { data: columns, error: columnsError } = await supabase
    .from("columns")
    .select(
      "id, public_id, title, created_at, plain_text_length, status, profiles!columns_author_id_fkey(user_id, display_name)",
    )
    .eq("status", "published")
    .in("id", columnIds);

  if (columnsError) {
    return { data: null, error: columnsError };
  }

  const columnById = new Map((columns ?? []).map((column) => [column.id, column]));
  const orderedColumns = likes
    .map((like) => columnById.get(like.column_id))
    .filter((column): column is NonNullable<typeof column> => column != null);

  return { data: orderedColumns, error: null };
});

export function sumPlainTextLength(
  columns: Pick<ColumnListItem, "plain_text_length">[],
): number {
  return columns.reduce((sum, column) => sum + column.plain_text_length, 0);
}
