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
    <form action={formAction} className="stack">
      {column && <input type="hidden" name="column_id" value={column.id} />}

      <div className="field">
        <label htmlFor="title" className="label">
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
          className="input"
        />
        <p className={`hint ${isTitleOverLimit ? "text-red-600" : ""}`}>
          {title.length} / {TITLE_MAX_LENGTH} 文字
        </p>
      </div>

      <div className="field">
        <label className="label">コラム本文</label>
        <p className="hint">
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

      {state.error && <p className="alert-error">{state.error}</p>}

      <div className="btn-row">
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
          className="btn"
        >
          {isPending ? "保存中..." : isEditingDraft ? "公開する" : "投稿する"}
        </button>
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={isPending || isDraftEmpty || isTitleOverLimit}
          className="btn-outline"
        >
          {isPending ? "保存中..." : "下書き保存"}
        </button>
      </div>

      {isContentTooShort && plainTextLength > 0 && (
        <p className="hint text-center">
          投稿するには本文があと{charsUntilMin}文字必要です
        </p>
      )}
    </form>
  );
}
