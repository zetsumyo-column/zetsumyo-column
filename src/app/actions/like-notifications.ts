"use server";

import {
  getLikeNotifications,
  type LikeNotification,
} from "@/lib/column/like-notifications";
import { getRequiredAuthUser } from "@/lib/supabase/auth";

export type LikeNotificationsResult =
  | { notifications: LikeNotification[] }
  | { error: string };

export async function fetchLikeNotifications(): Promise<LikeNotificationsResult> {
  try {
    const user = await getRequiredAuthUser();
    const notifications = await getLikeNotifications(user.id);

    return { notifications };
  } catch {
    return { error: "通知の取得に失敗しました" };
  }
}
