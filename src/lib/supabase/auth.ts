import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

type AuthUserResult = {
  user: User | null;
};

export const getAuthUser = cache(async (): Promise<AuthUserResult> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user };
});
