import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
