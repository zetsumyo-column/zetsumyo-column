import {
  CHAR_LIMIT_OPTIONS,
  TITLE_MAX_LENGTH,
  type CharLimit,
  DEFAULT_CHAR_LIMIT,
} from "@/lib/constants/column";
import { getPlainTextLength } from "@/lib/column/content";

export function parseCharLimit(value: unknown): CharLimit {
  const num = Number(value);
  if (CHAR_LIMIT_OPTIONS.includes(num as CharLimit)) {
    return num as CharLimit;
  }
  return DEFAULT_CHAR_LIMIT;
}

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

export function validateColumnContent(
  html: string,
  charLimit: CharLimit,
): string | null {
  const plainTextLength = getPlainTextLength(html);

  if (plainTextLength < 1) {
    return "本文を入力してください";
  }
  if (plainTextLength > charLimit) {
    return `${charLimit}文字以内で入力してください（現在 ${plainTextLength} 文字）`;
  }
  return null;
}
