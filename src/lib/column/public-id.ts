const PUBLIC_ID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const PUBLIC_ID_LENGTH = 7;

/** プロフィールの予約語・コラムURLと衝突する public_id */
export const RESERVED_COLUMN_PUBLIC_IDS = new Set([
  "published",
  "drafts",
  "feed",
  "followers",
  "following",
  "edit",
  "new",
  "columns",
  "settings",
  "login",
  "signup",
  "terms",
  "privacy",
  "design",
  "mypage",
  "auth",
  "users",
]);

const PUBLIC_ID_PATTERN = /^[0-9a-z]{7}$/;

export function isValidColumnPublicId(value: string): boolean {
  return PUBLIC_ID_PATTERN.test(value);
}

export function isReservedColumnPublicId(value: string): boolean {
  return RESERVED_COLUMN_PUBLIC_IDS.has(value.toLowerCase());
}

export function generateColumnPublicId(): string {
  const bytes = new Uint8Array(PUBLIC_ID_LENGTH);
  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => PUBLIC_ID_ALPHABET[byte % PUBLIC_ID_ALPHABET.length],
  ).join("");
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
