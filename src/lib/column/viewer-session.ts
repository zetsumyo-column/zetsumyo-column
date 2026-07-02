import { cookies } from "next/headers";

const VIEWER_SESSION_COOKIE = "column_viewer_session";
const VIEWER_KEY_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;

export async function getOrCreateViewerSessionKey(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VIEWER_SESSION_COOKIE)?.value;

  if (existing && VIEWER_KEY_REGEX.test(existing)) {
    return existing;
  }

  const sessionKey = crypto.randomUUID();
  cookieStore.set(VIEWER_SESSION_COOKIE, sessionKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return sessionKey;
}
