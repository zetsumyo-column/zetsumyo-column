import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/lib/constants/column";
import { getPlainTextLength } from "@/lib/column/content";

export function validateColumnTitle(title: string): string | null {
  const trimmed = title.trim();

  if (trimmed.length < 1) {
    return "タイトルを入力してください";
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください（現在 ${trimmed.length} 文字）`;
  }
  return null;
}

export function validateColumnContent(html: string): string | null {
  const plainTextLength = getPlainTextLength(html);

  if (plainTextLength < CONTENT_MIN_LENGTH) {
    return `本文は${CONTENT_MIN_LENGTH}文字以上で入力してください（現在 ${plainTextLength} 文字）`;
  }
  if (plainTextLength > CONTENT_MAX_LENGTH) {
    return `本文は${CONTENT_MAX_LENGTH}文字以内で入力してください（現在 ${plainTextLength} 文字）`;
  }
  return null;
}
