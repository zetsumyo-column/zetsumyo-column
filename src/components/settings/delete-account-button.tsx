"use client";

import { deleteAccount } from "@/app/actions/account";

const CONFIRM_MESSAGE =
  "アカウントを削除すると、プロフィール・公開済みコラム・下書き・いいね・フォロー関係がすべて削除され、元に戻せません。本当に削除しますか？";

export function DeleteAccountButton() {
  return (
    <form action={deleteAccount}>
      <button
        type="submit"
        className="btn-outline w-full"
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
