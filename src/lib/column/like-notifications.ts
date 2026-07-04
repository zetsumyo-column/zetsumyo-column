import { createClient } from "@/lib/supabase/server";

export type LikeNotification = {
  id: string;
  createdAt: string;
  liker: {
    userId: string;
    displayName: string;
    avatarUrl: string | null;
  };
  column: {
    publicId: string;
    title: string;
  };
};

const NOTIFICATION_LIMIT = 20;

export async function getLikeNotifications(
  authorId: string,
): Promise<LikeNotification[]> {
  const supabase = await createClient();

  const { data: columns, error: columnsError } = await supabase
    .from("columns")
    .select("id, public_id, title")
    .eq("author_id", authorId)
    .eq("status", "published");

  if (columnsError) {
    console.error("like notifications columns error:", columnsError);
    return [];
  }

  if (!columns?.length) {
    return [];
  }

  const columnById = new Map(columns.map((column) => [column.id, column]));
  const columnIds = columns.map((column) => column.id);

  const { data: likes, error: likesError } = await supabase
    .from("column_likes")
    .select("id, created_at, column_id, user_id")
    .in("column_id", columnIds)
    .order("created_at", { ascending: false })
    .limit(NOTIFICATION_LIMIT);

  if (likesError) {
    console.error("like notifications likes error:", likesError);
    return [];
  }

  if (!likes?.length) {
    return [];
  }

  const likerIds = [...new Set(likes.map((like) => like.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, user_id, display_name, avatar_url")
    .in("id", likerIds);

  if (profilesError) {
    console.error("like notifications profiles error:", profilesError);
    return [];
  }

  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  const notifications: LikeNotification[] = [];

  for (const like of likes) {
    const column = columnById.get(like.column_id);
    const liker = profileById.get(like.user_id);

    if (!column || !liker) {
      continue;
    }

    notifications.push({
      id: like.id,
      createdAt: like.created_at,
      liker: {
        userId: liker.user_id,
        displayName: liker.display_name,
        avatarUrl: liker.avatar_url,
      },
      column: {
        publicId: column.public_id,
        title: column.title,
      },
    });
  }

  return notifications;
}
