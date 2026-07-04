"use client";

import { deleteColumn } from "@/app/actions/column";

type DeleteColumnButtonProps = {
  columnId: string;
  className?: string;
  isPublished?: boolean;
};

export function DeleteColumnButton({
  columnId,
  className = "link",
  isPublished = false,
}: DeleteColumnButtonProps) {
  const confirmMessage = isPublished
    ? "公開済みのコラムを削除しますか？この操作は取り消せません。"
    : "このコラムを削除しますか？";

  return (
    <form action={deleteColumn}>
      <input type="hidden" name="column_id" value={columnId} />
      <button
        type="submit"
        className={className}
        onClick={(e) => {
          if (!confirm(confirmMessage)) {
            e.preventDefault();
          }
        }}
      >
        削除
      </button>
    </form>
  );
}
