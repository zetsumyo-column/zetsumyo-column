import { redirect } from "next/navigation";

import { getProfilePublishedPath } from "@/lib/profile/paths";

type UserProfilePageProps = {
  params: Promise<{ user_id: string }>;
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { user_id } = await params;
  redirect(getProfilePublishedPath(user_id));
}
