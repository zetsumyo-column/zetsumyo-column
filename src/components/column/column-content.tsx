"use client";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { isHtmlContent } from "@/lib/column/content";

type ColumnContentProps = {
  content: string;
};

function splitPlainTextParagraphs(content: string): string[] {
  return content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function ColumnContent({ content }: ColumnContentProps) {
  const { style } = useColumnTypography();

  if (isHtmlContent(content)) {
    return (
      <div
        className="column-content w-full break-words"
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = splitPlainTextParagraphs(content);

  if (paragraphs.length > 1) {
    return (
      <div className="column-content w-full break-words" style={style}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-wrap">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="column-content w-full break-words" style={style}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}
