import { redirect } from "next/navigation";

import { getOwnProfileUserId } from "@/lib/profile/own-profile";
import { getProfileFeedPath } from "@/lib/profile/paths";

export default async function MypageFollowingRedirect() {
  const userId = await getOwnProfileUserId("/mypage/following");
  redirect(getProfileFeedPath(userId));
}
