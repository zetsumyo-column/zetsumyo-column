/** HTML からプレーンテキストを抽出する */
export function getPlainTextFromHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** 空白・改行を除いた文字数のみを数える */
export function countTextCharacters(text: string): number {
  return text.replace(/\s/gu, "").length;
}

/** 投稿制限・表示用の文字数（空白・改行は含めない） */
export function getPlainTextLength(html: string): number {
  return countTextCharacters(getPlainTextFromHtml(html));
}

/** タイトルの文字数（空白・改行は含めない） */
export function getTitleCharacterCount(title: string): number {
  return countTextCharacters(title.trim());
}

/** プレーンテキストのみの既存投稿かどうか（TipTap 導入前） */
export function isHtmlContent(content: string): boolean {
  return /<[^>]+>/.test(content);
}
