export const USER_ID_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export function validateUserId(userId: string): string | null {
  if (!USER_ID_REGEX.test(userId)) {
    return "IDは英数字とアンダースコアのみ、3〜30文字で入力してください";
  }
  return null;
}

export function validateDisplayName(displayName: string): string | null {
  const trimmed = displayName.trim();
  if (trimmed.length < 1 || trimmed.length > 50) {
    return "ユーザー名は1〜50文字で入力してください";
  }
  return null;
}
