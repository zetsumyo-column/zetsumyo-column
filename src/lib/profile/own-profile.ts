import { redirect } from "next/navigation";

import { getRequiredAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function getOwnProfileUserId(next?: string): Promise<string> {
  const user = await getRequiredAuthUser(next);
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("id", user.id)
    .single();

  if (!profile?.user_id) {
    redirect("/login");
  }

  return profile.user_id;
}
