"use client";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { sanitizeToParagraphsOnly } from "@/lib/column/sanitize-content";

type ColumnContentProps = {
  content: string;
};

export function ColumnContent({ content }: ColumnContentProps) {
  const { style } = useColumnTypography();
  const html = sanitizeToParagraphsOnly(content);

  return (
    <div
      className="column-content w-full break-words"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
