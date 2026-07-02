import { redirect } from "next/navigation";

import { getAuthUser } from "@/lib/supabase/auth";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return children;
}
