"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteColumn } from "@/app/actions/column";

type DeleteColumnButtonProps = {
  columnId: string;
  className?: string;
};

export function DeleteColumnButton({
  columnId,
  className = "inline-flex items-center gap-1 text-xs text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
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
        <TrashIcon className="h-4 w-4 shrink-0" aria-hidden />
        削除
      </button>
    </form>
  );
}
