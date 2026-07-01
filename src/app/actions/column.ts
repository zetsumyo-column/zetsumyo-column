"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  parseCharLimit,
  validateColumnContent,
  validateColumnTitle,
} from "@/lib/validation/column";
import { createClient } from "@/lib/supabase/server";

export type ColumnFormState = {
  error?: string;
};

export async function createColumn(
  _prevState: ColumnFormState,
  formData: FormData,
): Promise<ColumnFormState> {
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  const charLimit = parseCharLimit(formData.get("char_limit"));

  const titleError = validateColumnTitle(title);
  if (titleError) {
    return { error: titleError };
  }

  const validationError = validateColumnContent(content, charLimit);
  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  const { error } = await supabase.from("columns").insert({
    author_id: user.id,
    title: title.trim(),
    content,
    char_limit: charLimit,
  });

  if (error) {
    return { error: "投稿に失敗しました。もう一度お試しください" };
  }

  revalidatePath("/columns");
  revalidatePath("/");
  redirect("/columns");
}
