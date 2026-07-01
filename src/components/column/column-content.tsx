import { isHtmlContent } from "@/lib/column/content";

type ColumnContentProps = {
  content: string;
};

export function ColumnContent({ content }: ColumnContentProps) {
  if (isHtmlContent(content)) {
    return (
      <div
        className="column-content text-sm leading-relaxed break-words"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {content}
    </p>
  );
}
