import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

import {
  getFollowersPath,
  getFollowingPath,
  getProfilePath,
} from "@/lib/profile/paths";

export type FollowProfile = Pick<
  Profile,
  "id" | "user_id" | "display_name" | "avatar_url"
>;

export type FollowInfo = {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export async function getFollowInfo(
  profileId: string,
  currentUserId?: string,
): Promise<FollowInfo> {
  const supabase = await createClient();

  const [
    { count: followerCount, error: followerError },
    { count: followingCount, error: followingError },
  ] = await Promise.all([
    supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", profileId),
    supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profileId),
  ]);

  if (followerError || followingError) {
    return { followerCount: 0, followingCount: 0, isFollowing: false };
  }

  if (!currentUserId || currentUserId === profileId) {
    return {
      followerCount: followerCount ?? 0,
      followingCount: followingCount ?? 0,
      isFollowing: false,
    };
  }

  const { data, error: followError } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", currentUserId)
    .eq("following_id", profileId)
    .maybeSingle();

  if (followError) {
    return {
      followerCount: followerCount ?? 0,
      followingCount: followingCount ?? 0,
      isFollowing: false,
    };
  }

  return {
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
    isFollowing: !!data,
  };
}

export type FollowListRow = {
  created_at: string;
  profiles: FollowProfile;
};

export async function getFollowers(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      "created_at, profiles!user_follows_follower_id_fkey(id, user_id, display_name, avatar_url)",
    )
    .eq("following_id", profileId)
    .order("created_at", { ascending: false });

  return {
    data: (data ?? null) as FollowListRow[] | null,
    error,
  };
}

export async function getFollowing(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      "created_at, profiles!user_follows_following_id_fkey(id, user_id, display_name, avatar_url)",
    )
    .eq("follower_id", profileId)
    .order("created_at", { ascending: false });

  return {
    data: (data ?? null) as FollowListRow[] | null,
    error,
  };
}

export function getProfileHref(
  profileUserId: string,
  currentUserId?: string,
  profileId?: string,
): string {
  if (currentUserId && profileId && currentUserId === profileId) {
    return "/mypage";
  }

  return getProfilePath(profileUserId);
}
