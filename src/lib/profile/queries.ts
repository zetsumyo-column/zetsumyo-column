import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getProfileByUserId = cache(async (userId: string) => {
  const supabase = await createClient();
  return supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
});

export async function getProfileUserId(profileId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.user_id;
}
