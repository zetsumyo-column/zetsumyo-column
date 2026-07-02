/** OAuth コールバック等で使う相対パスのみ許可する */
export function getSafeRedirectPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  if (next.includes("://") || next.includes("\\")) {
    return "/";
  }

  return next;
}
