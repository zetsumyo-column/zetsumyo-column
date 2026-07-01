/** HTML からプレーンテキストを抽出し、文字数制限のカウントに使う */
export function getPlainTextFromHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getPlainTextLength(html: string): number {
  return getPlainTextFromHtml(html).length;
}

/** プレーンテキストのみの既存投稿かどうか（TipTap 導入前） */
export function isHtmlContent(content: string): boolean {
  return /<[^>]+>/.test(content);
}
