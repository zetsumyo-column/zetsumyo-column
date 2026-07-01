import {
  CHAR_LIMIT_OPTIONS,
  type CharLimit,
  DEFAULT_CHAR_LIMIT,
} from "@/lib/constants/column";

export function parseCharLimit(value: unknown): CharLimit {
  const num = Number(value);
  if (CHAR_LIMIT_OPTIONS.includes(num as CharLimit)) {
    return num as CharLimit;
  }
  return DEFAULT_CHAR_LIMIT;
}

export function validateColumnContent(
  content: string,
  charLimit: CharLimit,
): string | null {
  const trimmed = content.trim();
  if (trimmed.length < 1) {
    return "本文を入力してください";
  }
  if (content.length > charLimit) {
    return `${charLimit}文字以内で入力してください（現在 ${content.length} 文字）`;
  }
  return null;
}
