"use client";

import { useActionState, useState } from "react";

import { saveColumn, type ColumnFormState } from "@/app/actions/column";
import { ColumnEditor } from "@/components/column/column-editor";
import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  DRAFT_TITLE_PLACEHOLDER,
  TITLE_MAX_LENGTH,
} from "@/lib/constants/column";
import { getPlainTextLength } from "@/lib/column/content";
import type { Column } from "@/types/database";

const initialState: ColumnFormState = {};

type ColumnFormProps = {
  column?: Pick<Column, "id" | "title" | "content" | "status">;
};

function getInitialTitle(column?: ColumnFormProps["column"]): string {
  if (!column) return "";
  if (column.title === DRAFT_TITLE_PLACEHOLDER) return "";
  return column.title;
}

export function ColumnForm({ column }: ColumnFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveColumn,
    initialState,
  );
  const [title, setTitle] = useState(() => getInitialTitle(column));
  const [content, setContent] = useState(column?.content ?? "");
  const [plainTextLength, setPlainTextLength] = useState(() =>
    getPlainTextLength(column?.content ?? ""),
  );

  const isContentTooShort = plainTextLength < CONTENT_MIN_LENGTH;
  const isTitleEmpty = title.trim().length === 0;
  const isTitleOverLimit = title.length > TITLE_MAX_LENGTH;
  const isDraftEmpty = isTitleEmpty && plainTextLength === 0;
  const charsUntilMin = Math.max(0, CONTENT_MIN_LENGTH - plainTextLength);
  const isEditingDraft = column?.status === "draft";

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
      {column && <input type="hidden" name="column_id" value={column.id} />}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          タイトル
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={TITLE_MAX_LENGTH}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="コラムのタイトル"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
        />
        <p
          className={`text-xs ${isTitleOverLimit ? "text-red-600" : "text-zinc-500"}`}
        >
          {title.length} / {TITLE_MAX_LENGTH} 文字
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          コラム本文
        </label>
        <p className="text-xs text-zinc-500">
          投稿時は{CONTENT_MIN_LENGTH}文字以上{CONTENT_MAX_LENGTH}文字以内
        </p>
        <input type="hidden" name="content" value={content} />
        <ColumnEditor
          initialContent={column?.content ?? ""}
          onChange={(html, length) => {
            setContent(html);
            setPlainTextLength(length);
          }}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={
            isPending ||
            isContentTooShort ||
            isTitleEmpty ||
            isTitleOverLimit
          }
          className="h-12 flex-1 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isPending ? "保存中..." : isEditingDraft ? "公開する" : "投稿する"}
        </button>
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={isPending || isDraftEmpty || isTitleOverLimit}
          className="h-12 flex-1 rounded-lg border border-zinc-300 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {isPending ? "保存中..." : "下書き保存"}
        </button>
      </div>

      {isContentTooShort && plainTextLength > 0 && (
        <p className="text-center text-xs text-zinc-500">
          投稿するには本文があと{charsUntilMin}文字必要です
        </p>
      )}
    </form>
  );
}
