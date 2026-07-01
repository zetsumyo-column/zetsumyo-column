import { createClient } from "@/lib/supabase/server";

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
