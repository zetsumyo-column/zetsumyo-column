"use client";

import { useActionState, useState } from "react";

import {
  createColumn,
  type ColumnFormState,
} from "@/app/actions/column";
import { ColumnEditor } from "@/components/column/column-editor";
import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/lib/constants/column";

const initialState: ColumnFormState = {};

export function ColumnForm() {
  const [state, formAction, isPending] = useActionState(
    createColumn,
    initialState,
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plainTextLength, setPlainTextLength] = useState(0);

  const isContentTooShort = plainTextLength < CONTENT_MIN_LENGTH;
  const isTitleEmpty = title.trim().length === 0;
  const isTitleOverLimit = title.length > TITLE_MAX_LENGTH;
  const charsUntilMin = Math.max(0, CONTENT_MIN_LENGTH - plainTextLength);

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
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
          required
          maxLength={TITLE_MAX_LENGTH}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="コラムのタイトル"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
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
          {CONTENT_MIN_LENGTH}文字以上{CONTENT_MAX_LENGTH}文字以内
        </p>
        <input type="hidden" name="content" value={content} />
        <ColumnEditor
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

      <button
        type="submit"
        disabled={
          isPending ||
          isContentTooShort ||
          isTitleEmpty ||
          isTitleOverLimit
        }
        className="h-12 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "投稿中..." : "投稿する"}
      </button>
      {isContentTooShort && plainTextLength > 0 && (
        <p className="text-center text-xs text-zinc-500">
          本文はあと{charsUntilMin}文字で投稿できます
        </p>
      )}
    </form>
  );
}
