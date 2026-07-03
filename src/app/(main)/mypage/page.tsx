import { redirect } from "next/navigation";

import { getOwnProfileUserId } from "@/lib/profile/own-profile";
import { getProfilePublishedPath } from "@/lib/profile/paths";

export default async function MypageRedirect() {
  const userId = await getOwnProfileUserId("/mypage");
  redirect(getProfilePublishedPath(userId));
}
