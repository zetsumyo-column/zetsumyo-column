export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;

export const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
] as const;

export type AvatarMimeType = (typeof AVATAR_ALLOWED_TYPES)[number];

const AVATAR_EXTENSION_BY_TYPE: Record<AvatarMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

export function getAvatarExtension(type: string): string | null {
  if (!AVATAR_ALLOWED_TYPES.includes(type as AvatarMimeType)) {
    return null;
  }

  return AVATAR_EXTENSION_BY_TYPE[type as AvatarMimeType];
}

export function validateAvatarFile(file: File): string | null {
  if (file.size === 0) {
    return null;
  }

  if (!AVATAR_ALLOWED_TYPES.includes(file.type as AvatarMimeType)) {
    return "プロフィール画像は JPEG、PNG のいずれかを選んでください";
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return "プロフィール画像は2MB以内にしてください";
  }

  return null;
}
