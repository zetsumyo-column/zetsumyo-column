"use client";

import { useActionState, useState } from "react";

import {
  createColumn,
  type ColumnFormState,
} from "@/app/actions/column";
import {
  CHAR_LIMIT_OPTIONS,
  DEFAULT_CHAR_LIMIT,
  type CharLimit,
} from "@/lib/constants/column";

const initialState: ColumnFormState = {};

export function ColumnForm() {
  const [state, formAction, isPending] = useActionState(
    createColumn,
    initialState,
  );
  const [charLimit, setCharLimit] = useState<CharLimit>(DEFAULT_CHAR_LIMIT);
  const [content, setContent] = useState("");

  const remaining = charLimit - content.length;
  const isOverLimit = remaining < 0;

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="char_limit"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
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
        <label
          htmlFor="content"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          コラム本文
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`${charLimit}文字以内で、絶妙なコラムを書いてみましょう`}
          className="resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <p
          className={`text-right text-sm ${
            isOverLimit ? "text-red-600" : "text-zinc-500"
          }`}
        >
          {content.length} / {charLimit}
        </p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || isOverLimit || content.trim().length === 0}
        className="h-12 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
