"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import type { CharLimit } from "@/lib/constants/column";

type ColumnEditorProps = {
  charLimit: CharLimit;
  content: string;
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
  charLimit,
  content,
  onChange,
}: ColumnEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[140px] px-4 py-3 focus:outline-none text-sm leading-relaxed",
        "data-placeholder": "絶妙なコラムを書いてみましょう",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML(), currentEditor.getText().trim().length);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentText = editor.getText().trim();
    const incomingText = content.replace(/<[^>]*>/g, "").trim();
    if (editor.getHTML() !== content && currentText !== incomingText) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-[180px] rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900" />
    );
  }

  const plainTextLength = editor.getText().trim().length;
  const isOverLimit = plainTextLength > charLimit;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
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

      <EditorContent editor={editor} />

      <p
        className={`border-t border-zinc-200 px-4 py-2 text-right text-sm dark:border-zinc-800 ${
          isOverLimit ? "text-red-600" : "text-zinc-500"
        }`}
      >
        {plainTextLength} / {charLimit}
      </p>
    </div>
  );
}
