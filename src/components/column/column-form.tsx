"use client";

import { useActionState, useState } from "react";

import {
  createColumn,
  type ColumnFormState,
} from "@/app/actions/column";
import { ColumnEditor } from "@/components/column/column-editor";
import {
  CHAR_LIMIT_OPTIONS,
  DEFAULT_CHAR_LIMIT,
  TITLE_MAX_LENGTH,
  type CharLimit,
} from "@/lib/constants/column";

const initialState: ColumnFormState = {};

export function ColumnForm() {
  const [state, formAction, isPending] = useActionState(
    createColumn,
    initialState,
  );
  const [charLimit, setCharLimit] = useState<CharLimit>(DEFAULT_CHAR_LIMIT);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plainTextLength, setPlainTextLength] = useState(0);

  const isOverLimit = plainTextLength > charLimit;
  const isContentEmpty = plainTextLength === 0;
  const isTitleEmpty = title.trim().length === 0;
  const isTitleOverLimit = title.length > TITLE_MAX_LENGTH;

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
          文字数制限
        </label>
        <div className="flex flex-wrap gap-2">
          {CHAR_LIMIT_OPTIONS.map((limit) => (
            <button
              key={limit}
              type="button"
              onClick={() => setCharLimit(limit)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                charLimit === limit
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {limit}文字
            </button>
          ))}
        </div>
        <input type="hidden" name="char_limit" value={charLimit} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          コラム本文
        </label>
        <input type="hidden" name="content" value={content} />
        <ColumnEditor
          charLimit={charLimit}
          content={content}
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
        disabled={isPending || isOverLimit || isContentEmpty || isTitleEmpty || isTitleOverLimit}
        className="h-12 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
