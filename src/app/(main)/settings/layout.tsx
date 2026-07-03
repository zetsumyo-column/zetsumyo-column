import { getRequiredAuthUser } from "@/lib/supabase/auth";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  await getRequiredAuthUser();

  return children;
}
