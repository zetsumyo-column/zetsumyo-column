import type { NextConfig } from "next";

function getSupabaseImagePattern():
  | {
      protocol: "https";
      hostname: string;
      pathname: string;
    }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return null;
  }

  try {
    const hostname = new URL(url.replace(/\/rest\/v1\/?$/, "")).hostname;
    return {
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
}

const supabaseImagePattern = getSupabaseImagePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      ...(supabaseImagePattern ? [supabaseImagePattern] : []),
    ],
  },
  async redirects() {
    return [
      {
        source: "/users/:user_id",
        destination: "/:user_id",
        permanent: true,
      },
      {
        source: "/users/:user_id/followers",
        destination: "/:user_id/followers",
        permanent: true,
      },
      {
        source: "/users/:user_id/following",
        destination: "/:user_id/following",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
