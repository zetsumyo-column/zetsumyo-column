import type { Metadata } from "next";

import { LEGAL_SITE_NAME } from "@/lib/legal/site";
import { getSiteUrl } from "@/lib/supabase/env";

export const SITE_DESCRIPTION = "文字数制限コラムサービス";

export const OGP_IMAGE = {
  path: "/ogp.png",
  width: 1200,
  height: 630,
  alt: LEGAL_SITE_NAME,
} as const;

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    icons: {
      icon: {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      shortcut: "/favicon.svg",
    },
    title: {
      default: LEGAL_SITE_NAME,
      template: `%s | ${LEGAL_SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: LEGAL_SITE_NAME,
      title: LEGAL_SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: OGP_IMAGE.path,
          width: OGP_IMAGE.width,
          height: OGP_IMAGE.height,
          alt: OGP_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: LEGAL_SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [OGP_IMAGE.path],
    },
  };
}
