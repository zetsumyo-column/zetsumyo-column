import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ColumnTypographyProvider } from "@/components/column/column-typography-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { THEME_INIT_SCRIPT } from "@/lib/theme/init-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "絶妙コラム",
  description: "文字数制限コラムサービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>
          <ColumnTypographyProvider>
            <div className="flex min-h-full flex-1 flex-col">{children}</div>
            <SiteFooter />
          </ColumnTypographyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
