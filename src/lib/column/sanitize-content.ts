import { isHtmlContent } from "@/lib/column/content";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToParagraphTexts(html: string): string[] {
  const plain = decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/(div|h[1-6]|li|blockquote|tr)>/gi, "\n")
      .replace(/<[^>]*>/g, ""),
  );

  return plain
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function plainTextToParagraphTexts(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter((block) => block.length > 0);
}

/** 本文を `<p>` タグのみの HTML に正規化する */
export function sanitizeToParagraphsOnly(content: string): string {
  if (!content.trim()) {
    return "<p></p>";
  }

  const paragraphs = isHtmlContent(content)
    ? htmlToParagraphTexts(content)
    : plainTextToParagraphTexts(content);

  if (paragraphs.length === 0) {
    return "<p></p>";
  }

  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}
