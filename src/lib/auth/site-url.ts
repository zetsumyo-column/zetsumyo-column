import { headers } from "next/headers";

import { getSiteUrl } from "@/lib/supabase/env";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/** クライアントから渡された origin が OAuth コールバック先として信頼できるか */
export function isTrustedAuthOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);

    if (isLocalHostname(url.hostname)) {
      return true;
    }

    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    if (configured) {
      return url.origin === new URL(configured).origin;
    }

    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/** OAuth 用のサイト URL を決定する（クライアント origin を最優先） */
export async function resolveAuthSiteUrl(
  clientOrigin?: string,
): Promise<string> {
  const trimmedOrigin = clientOrigin?.trim();
  if (trimmedOrigin && isTrustedAuthOrigin(trimmedOrigin)) {
    return trimmedOrigin;
  }

  if (process.env.NODE_ENV === "development") {
    return getSiteUrl();
  }

  return getRequestSiteUrl();
}

/** 現在のリクエスト元 URL */
export async function getRequestSiteUrl(): Promise<string> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    headersList.get("host");

  if (host) {
    const forwardedProto = headersList
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const protocol =
      forwardedProto ??
      (isLocalHostname(host.split(":")[0] ?? host) ? "http" : "https");

    const origin = `${protocol}://${host}`;

    if (
      process.env.NODE_ENV !== "production" ||
      isTrustedAuthOrigin(origin)
    ) {
      return origin;
    }
  }

  return getSiteUrl();
}

export function getRequestSiteUrlFromRequest(request: Request): string {
  const origin = new URL(request.url).origin;

  if (
    process.env.NODE_ENV !== "production" ||
    isTrustedAuthOrigin(origin)
  ) {
    return origin;
  }

  return getSiteUrl();
}
