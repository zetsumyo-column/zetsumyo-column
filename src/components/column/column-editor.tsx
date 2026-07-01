"use client";

import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import { getPlainTextLength } from "@/lib/column/content";
import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
} from "@/lib/constants/column";

type ColumnEditorProps = {
  initialContent?: string;
  onChange: (html: string, plainTextLength: number) => void;
};

export function ColumnEditor({
  initialContent = "",
  onChange,
}: ColumnEditorProps) {
  const [plainTextLength, setPlainTextLength] = useState(() =>
    getPlainTextLength(initialContent),
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      CharacterCount.configure({
        limit: CONTENT_MAX_LENGTH,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap",
        "data-placeholder": "絶妙なコラムを書いてみましょう",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      const length = getPlainTextLength(html);
      setPlainTextLength(length);
      onChange(html, length);
    },
  });

  if (!editor) {
    return <div className="column-editor editor min-h-[320px]" />;
  }

  const isTooShort = plainTextLength > 0 && plainTextLength < CONTENT_MIN_LENGTH;
  const charsUntilMin = Math.max(0, CONTENT_MIN_LENGTH - plainTextLength);

  return (
    <div className="column-editor editor">
      <EditorContent editor={editor} />
      <div className={`editor-footer ${isTooShort ? "text-red-600" : ""}`}>
        <p>
          {plainTextLength} / {CONTENT_MAX_LENGTH}
        </p>
        {isTooShort && (
          <p className="hint mt-1">あと{charsUntilMin}文字で投稿できます</p>
        )}
      </div>
    </div>
  );
}
