import { cache } from "react";

import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export const getHeaderProfile = cache(async () => {
  const { user } = await getAuthUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("avatar_url, display_name, user_id")
    .eq("id", user.id)
    .single();

  return data;
});
