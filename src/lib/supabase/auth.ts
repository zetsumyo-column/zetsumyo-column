import { cache } from "react";
import { redirect } from "next/navigation";

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

export async function getRequiredAuthUser(next?: string): Promise<User> {
  const { user } = await getAuthUser();

  if (!user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }

  return user;
}
