import { isReservedUserId } from "@/lib/profile/paths";

export const USER_ID_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export const BIO_MAX_LENGTH = 200;

export function validateUserId(userId: string): string | null {
  if (!USER_ID_REGEX.test(userId)) {
    return "IDは英数字とアンダースコアのみ、3〜30文字で入力してください";
  }
  if (isReservedUserId(userId)) {
    return "このIDは使用できません";
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

export function validateBio(bio: string): string | null {
  if (bio.length > BIO_MAX_LENGTH) {
    return `自己紹介文は${BIO_MAX_LENGTH}文字以内で入力してください（現在 ${bio.length} 文字）`;
  }
  return null;
}
