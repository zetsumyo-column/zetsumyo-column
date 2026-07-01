"use client";

import { useActionState, useState } from "react";

import {
  updateProfile,
  type ProfileFormState,
} from "@/app/actions/profile";
import { ProfileAvatarField } from "@/components/profile/profile-avatar-field";
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
    <form action={formAction} className="stack">
      <ProfileAvatarField
        displayName={profile.display_name}
        avatarUrl={profile.avatar_url}
      />

      <div className="field">
        <label htmlFor="user_id" className="label">
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
          className="input"
        />
        <p className="hint">英数字とアンダースコアのみ、3〜30文字</p>
      </div>

      <div className="field">
        <label htmlFor="display_name" className="label">
          ユーザー名
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={50}
          defaultValue={profile.display_name}
          className="input"
        />
      </div>

      <div className="field">
        <label htmlFor="bio" className="label">
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
          className="textarea"
        />
        <p className={`hint ${isBioOverLimit ? "text-red-600" : ""}`}>
          {bio.length} / {BIO_MAX_LENGTH} 文字
        </p>
      </div>

      {state.error && <p className="alert-error">{state.error}</p>}
      {state.warning && <p className="alert-warning">{state.warning}</p>}
      {state.success && <p className="alert-success">保存しました</p>}

      <button type="submit" disabled={isPending || isBioOverLimit} className="btn">
        {isPending ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
