const VIEWER_SESSION_STORAGE_KEY = "column_viewer_session";

export function getViewerSessionKey(): string {
  const existing = sessionStorage.getItem(VIEWER_SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionKey = crypto.randomUUID();
  sessionStorage.setItem(VIEWER_SESSION_STORAGE_KEY, sessionKey);
  return sessionKey;
}
