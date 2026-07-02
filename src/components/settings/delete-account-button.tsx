"use client";

import { deleteAccount } from "@/app/actions/account";

const CONFIRM_MESSAGE =
  "アカウントを削除すると、プロフィール・公開済みコラム・下書き・いいね・フォロー関係がすべて削除され、元に戻せません。本当に削除しますか？";

export function DeleteAccountButton() {
  return (
    <form action={deleteAccount}>
      <button
        type="submit"
        className="btn-outline w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        onClick={(e) => {
          if (!confirm(CONFIRM_MESSAGE)) {
            e.preventDefault();
          }
        }}
      >
        アカウントを削除する
      </button>
    </form>
  );
}
