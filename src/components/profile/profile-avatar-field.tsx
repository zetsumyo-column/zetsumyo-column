"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { getAvatarInitial } from "@/lib/profile/avatar";
import { AVATAR_ALLOWED_TYPES } from "@/lib/validation/avatar";

type ProfileAvatarFieldProps = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

export function ProfileAvatarField({
  userId,
  displayName,
  avatarUrl,
}: ProfileAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);

  useEffect(() => {
    setPreviewUrl(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="profile-avatar-card">
      <div className="profile-avatar-card-info">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={displayName}
            width={56}
            height={56}
            className="shrink-0 rounded-full"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        ) : (
          <div className="avatar h-14 w-14 shrink-0 text-lg">
            {getAvatarInitial(displayName, userId)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold">{userId}</p>
          <p className="muted truncate">{displayName}</p>
        </div>
      </div>

      <input
        ref={inputRef}
        id="avatar"
        name="avatar"
        type="file"
        accept={AVATAR_ALLOWED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          setPreviewUrl((current) => {
            if (current?.startsWith("blob:")) {
              URL.revokeObjectURL(current);
            }
            return URL.createObjectURL(file);
          });
        }}
      />
      <button
        type="button"
        className="btn-outline btn-sm shrink-0"
        onClick={() => inputRef.current?.click()}
      >
        写真を変更
      </button>
    </div>
  );
}
