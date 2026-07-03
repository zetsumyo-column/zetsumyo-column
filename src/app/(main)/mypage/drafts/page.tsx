import { redirect } from "next/navigation";

import { getOwnProfileUserId } from "@/lib/profile/own-profile";
import { getProfileDraftsPath } from "@/lib/profile/paths";

type MypageDraftsRedirectProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function MypageDraftsRedirect({
  searchParams,
}: MypageDraftsRedirectProps) {
  const { error } = await searchParams;
  const userId = await getOwnProfileUserId("/mypage/drafts");
  const path = getProfileDraftsPath(userId);
  redirect(error ? `${path}?error=${encodeURIComponent(error)}` : path);
}
