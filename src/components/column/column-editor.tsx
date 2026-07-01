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

function ToolbarButton({
  onClick,
  isActive,
  label,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        isActive
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

export function ColumnEditor({
  initialContent = "",
  onChange,
}: ColumnEditorProps) {
  const [plainTextLength, setPlainTextLength] = useState(() =>
    getPlainTextLength(initialContent),
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: CONTENT_MAX_LENGTH,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[280px] px-4 py-3 focus:outline-none text-sm leading-relaxed",
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
    return (
      <div className="column-editor min-h-[320px] rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800" />
    );
  }

  const isTooShort = plainTextLength > 0 && plainTextLength < CONTENT_MIN_LENGTH;
  const charsUntilMin = Math.max(0, CONTENT_MIN_LENGTH - plainTextLength);

  return (
    <div className="column-editor overflow-hidden rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
        <ToolbarButton
          label="太字"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="斜体"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarButton>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Enter
          </kbd>
          段落
        </span>
        <span className="inline-flex items-center gap-1.5">
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Enter
          </kbd>
          改行
        </span>
      </p>

      <EditorContent editor={editor} />

      <div
        className={`border-t border-zinc-200 px-4 py-2 text-right text-sm dark:border-zinc-800 ${
          isTooShort ? "text-red-600" : "text-zinc-500"
        }`}
      >
        <p>
          {plainTextLength} / {CONTENT_MAX_LENGTH}
        </p>
        {isTooShort && (
          <p className="mt-0.5 text-xs">あと{charsUntilMin}文字で投稿できます</p>
        )}
      </div>
    </div>
  );
}
