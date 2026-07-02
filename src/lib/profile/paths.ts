const RESERVED_USER_IDS = new Set([
  "auth",
  "columns",
  "login",
  "mypage",
  "settings",
  "signup",
  "users",
]);

export function getProfilePath(userId: string): string {
  return `/${userId}`;
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
