const RESERVED_USER_IDS = new Set([
  "auth",
  "columns",
  "design",
  "login",
  "mypage",
  "privacy",
  "settings",
  "signup",
  "terms",
  "users",
]);

export function getProfilePath(userId: string): string {
  return `/${userId}`;
}

export function getProfilePublishedPath(userId: string): string {
  return `/${userId}/published`;
}

export function getProfileDraftsPath(userId: string): string {
  return `/${userId}/drafts`;
}

/** フォローしている人のコラム（/{userId}/following はユーザーリスト用） */
export function getProfileFeedPath(userId: string): string {
  return `/${userId}/feed`;
}

export function getFollowersPath(userId: string): string {
  return `/${userId}/followers`;
}

export function getFollowingPath(userId: string): string {
  return `/${userId}/following`;
}

export function isReservedUserId(userId: string): boolean {
  return RESERVED_USER_IDS.has(userId.toLowerCase());
}
