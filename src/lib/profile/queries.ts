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
