type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string;
};

function errorText(error: SupabaseErrorLike): string {
  return `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
}

export function isCharLimitConstraintError(error: SupabaseErrorLike): boolean {
  return (
    error.code === "23514" && errorText(error).includes("char_limit")
  );
}

export function isTitleLengthConstraintError(error: SupabaseErrorLike): boolean {
  return (
    error.code === "23514" &&
    (errorText(error).includes("columns_title_max_characters") ||
      errorText(error).includes("columns_title_published_length") ||
      errorText(error).includes("columns_title_max_length"))
  );
}

export function isStatusColumnError(error: SupabaseErrorLike): boolean {
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    errorText(error).includes("status")
  );
}

export function getColumnSaveErrorMessage(error: SupabaseErrorLike | null): string {
  if (!error) {
    return "保存に失敗しました。もう一度お試しください";
  }

  if (isCharLimitConstraintError(error)) {
    return "データベースの文字数上限設定の更新が必要です。Supabase の SQL Editor で 008_columns_char_limit_1400.sql を実行してください";
  }

  if (isTitleLengthConstraintError(error)) {
    return "データベースのタイトル文字数設定の更新が必要です。Supabase の SQL Editor で 017_columns_title_length.sql を実行してください";
  }

  if (isStatusColumnError(error)) {
    return "データベースに下書き機能の設定が必要です。Supabase の SQL Editor で 007_columns_status.sql を実行してください";
  }

  return "保存に失敗しました。もう一度お試しください";
}

export function getProfileSaveErrorMessage(error: SupabaseErrorLike | null): string {
  if (!error) {
    return "保存に失敗しました。もう一度お試しください";
  }

  if (error.code === "23505") {
    return "この ID はすでに使用されています";
  }

  if (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    errorText(error).includes("bio")
  ) {
    return "自己紹介文の保存には 006_profiles_bio.sql の実行が必要です";
  }

  return "保存に失敗しました。もう一度お試しください";
}
