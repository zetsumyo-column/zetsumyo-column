"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { AVATAR_ALLOWED_TYPES } from "@/lib/validation/avatar";
import { getAvatarInitial } from "@/lib/profile/avatar";

type ProfileAvatarFieldProps = {
  displayName: string;
  avatarUrl: string | null;
};

export function ProfileAvatarField({
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
    <div className="field">
      <p className="label">プロフィール画像</p>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={displayName}
            width={80}
            height={80}
            className="rounded-full"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        ) : (
          <div className="avatar h-20 w-20 text-2xl">{getAvatarInitial(displayName)}</div>
        )}
        <div>
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
            className="btn-outline"
            onClick={() => inputRef.current?.click()}
          >
            画像を選ぶ
          </button>
          <p className="hint mt-2">JPEG、PNG（2MB以内）</p>
        </div>
      </div>
    </div>
  );
}
