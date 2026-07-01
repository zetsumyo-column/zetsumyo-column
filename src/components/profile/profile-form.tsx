"use client";

import { useActionState, useState } from "react";

import {
  updateProfile,
  type ProfileFormState,
} from "@/app/actions/profile";
import { BIO_MAX_LENGTH } from "@/lib/validation/profile";
import type { Profile } from "@/types/database";

const initialState: ProfileFormState = {};

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );
  const [bio, setBio] = useState(profile.bio ?? "");
  const isBioOverLimit = bio.length > BIO_MAX_LENGTH;

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="user_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ID
        </label>
        <input
          id="user_id"
          name="user_id"
          type="text"
          required
          defaultValue={profile.user_id}
          pattern="[a-zA-Z0-9_]{3,30}"
          title="英数字とアンダースコアのみ、3〜30文字"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <p className="text-xs text-zinc-500">
          英数字とアンダースコアのみ、3〜30文字
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="display_name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          ユーザー名
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={50}
          defaultValue={profile.display_name}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="bio"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          自己紹介文
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={BIO_MAX_LENGTH}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を書いてみましょう"
          className="resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <p
          className={`text-xs ${isBioOverLimit ? "text-red-600" : "text-zinc-500"}`}
        >
          {bio.length} / {BIO_MAX_LENGTH} 文字
        </p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.warning && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {state.warning}
        </p>
      )}

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          保存しました
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || isBioOverLimit}
        className="h-12 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
