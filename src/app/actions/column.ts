"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  CONTENT_MAX_LENGTH,
  DRAFT_TITLE_PLACEHOLDER,
  type ColumnStatus,
} from "@/lib/constants/column";
import {
  validateColumnContent,
  validateColumnDraft,
  validateColumnTitle,
} from "@/lib/validation/column";
import { sanitizeToParagraphsOnly } from "@/lib/column/sanitize-content";
import { getColumnSaveErrorMessage } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

export type ColumnFormState = {
  error?: string;
};

type ColumnPayload = {
  title: string;
  content: string;
  char_limit: number;
  status: ColumnStatus;
};

function parseIntent(value: unknown): "draft" | "publish" {
  return value === "draft" ? "draft" : "publish";
}

function resolveDraftTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : DRAFT_TITLE_PLACEHOLDER;
}

function revalidateColumnPaths() {
  revalidatePath("/");
  revalidatePath("/mypage");
}

function buildPayload(
  base: Omit<ColumnPayload, "char_limit">,
): ColumnPayload {
  return { ...base, char_limit: CONTENT_MAX_LENGTH };
}

export async function saveColumn(
  _prevState: ColumnFormState,
  formData: FormData,
): Promise<ColumnFormState> {
  const intent = parseIntent(formData.get("intent"));
  const columnId = String(formData.get("column_id") ?? "").trim();
  const title = String(formData.get("title") ?? "");
  const content = sanitizeToParagraphsOnly(String(formData.get("content") ?? ""));
  const status: ColumnStatus = intent === "draft" ? "draft" : "published";

  if (intent === "publish") {
    const titleError = validateColumnTitle(title);
    if (titleError) {
      return { error: titleError };
    }

    const validationError = validateColumnContent(content);
    if (validationError) {
      return { error: validationError };
    }
  } else {
    const draftError = validateColumnDraft(title, content);
    if (draftError) {
      return { error: draftError };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  const basePayload = {
    title: intent === "publish" ? title.trim() : resolveDraftTitle(title),
    content: content || "<p></p>",
    status,
  };

  if (columnId) {
    const { data: existing, error: fetchError } = await supabase
      .from("columns")
      .select("id, author_id, status")
      .eq("id", columnId)
      .maybeSingle();

    if (fetchError || !existing) {
      return { error: "コラムが見つかりません" };
    }

    if (existing.author_id !== user.id) {
      return { error: "編集権限がありません" };
    }

    if (existing.status !== "draft") {
      return { error: "公開済みのコラムは編集できません" };
    }

    const { error } = await supabase
      .from("columns")
      .update(buildPayload(basePayload))
      .eq("id", columnId)
      .eq("author_id", user.id);

    if (error) {
      console.error("column update error:", error);
      return { error: getColumnSaveErrorMessage(error) };
    }

    revalidateColumnPaths();
    revalidatePath(`/columns/${columnId}`);
    revalidatePath(`/columns/${columnId}/edit`);

    if (intent === "publish") {
      redirect(`/columns/${columnId}`);
    }

    redirect("/mypage");
  }

  const { data, error } = await supabase
    .from("columns")
    .insert({
      author_id: user.id,
      ...buildPayload(basePayload),
    })
    .select("id")
    .single();

  if (error) {
    console.error("column insert error:", error);
    return { error: getColumnSaveErrorMessage(error) };
  }

  if (!data) {
    return { error: "保存に失敗しました。もう一度お試しください" };
  }

  revalidateColumnPaths();

  if (intent === "publish") {
    redirect(`/columns/${data.id}`);
  }

  redirect("/mypage");
}

export async function deleteColumn(formData: FormData): Promise<void> {
  const columnId = String(formData.get("column_id") ?? "").trim();

  if (!columnId) {
    redirect("/mypage");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("columns")
    .select("id, status")
    .eq("id", columnId)
    .eq("author_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    redirect(
      `/mypage?error=${encodeURIComponent("コラムが見つかりません")}`,
    );
  }

  if (existing.status !== "draft") {
    redirect(
      `/mypage?error=${encodeURIComponent("公開済みのコラムは削除できません")}`,
    );
  }

  const { error } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnId)
    .eq("author_id", user.id)
    .eq("status", "draft");

  if (error) {
    console.error("column delete error:", error);
    redirect(
      `/mypage?error=${encodeURIComponent("削除に失敗しました")}`,
    );
  }

  revalidateColumnPaths();
  redirect("/mypage");
}
