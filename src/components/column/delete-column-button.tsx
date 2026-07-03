"use client";

import { deleteColumn } from "@/app/actions/column";

type DeleteColumnButtonProps = {
  columnId: string;
  className?: string;
};

export function DeleteColumnButton({
  columnId,
  className = "link",
}: DeleteColumnButtonProps) {
  return (
    <form action={deleteColumn}>
      <input type="hidden" name="column_id" value={columnId} />
      <button
        type="submit"
        className={className}
        onClick={(e) => {
          if (!confirm("このコラムを削除しますか？")) {
            e.preventDefault();
          }
        }}
      >
        削除
      </button>
    </form>
  );
}
