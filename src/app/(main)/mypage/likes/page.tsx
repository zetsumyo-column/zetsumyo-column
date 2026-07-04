import { redirect } from "next/navigation";

import { getOwnProfileUserId } from "@/lib/profile/own-profile";
import { getProfileLikesPath } from "@/lib/profile/paths";

export default async function MypageLikesRedirect() {
  const userId = await getOwnProfileUserId("/mypage/likes");
  redirect(getProfileLikesPath(userId));
}
