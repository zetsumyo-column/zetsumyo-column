"use client";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { isHtmlContent } from "@/lib/column/content";

type ColumnContentProps = {
  content: string;
};

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

  return (
    <div className="column-content w-full break-words" style={style}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}
