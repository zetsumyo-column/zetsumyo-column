import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants/column";
import { getPlainTextLength, getTitleCharacterCount } from "@/lib/column/content";

export function validateColumnTitle(title: string): string | null {
  const titleLength = getTitleCharacterCount(title);

  if (titleLength < TITLE_MIN_LENGTH) {
    return `タイトルは${TITLE_MIN_LENGTH}文字以上で入力してください（現在 ${titleLength} 文字）`;
  }
  if (titleLength > TITLE_MAX_LENGTH) {
    return `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください（現在 ${titleLength} 文字）`;
  }
  return null;
}

export function validateColumnTitleOptional(title: string): string | null {
  if (getTitleCharacterCount(title) === 0) {
    return null;
  }
  return validateColumnTitle(title);
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

export function validateColumnDraft(title: string, html: string): string | null {
  const plainTextLength = getPlainTextLength(html);

  if (getTitleCharacterCount(title) === 0 && plainTextLength === 0) {
    return "タイトルまたは本文を入力してください";
  }

  const titleError = validateColumnTitleOptional(title);
  if (titleError) {
    return titleError;
  }

  if (plainTextLength > CONTENT_MAX_LENGTH) {
    return `本文は${CONTENT_MAX_LENGTH}文字以内で入力してください（現在 ${plainTextLength} 文字）`;
  }

  return null;
}
