import Link from "next/link";

import { LEGAL_SITE_NAME } from "@/lib/legal/site";
import { getDesignPath, getPrivacyPath, getTermsPath } from "@/lib/legal/paths";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav aria-label="サイト情報" className="site-footer-nav">
          <Link href={getTermsPath()} className="site-footer-link">
            利用規約
          </Link>
          <Link href={getPrivacyPath()} className="site-footer-link">
            プライバシーポリシー
          </Link>
          <Link href={getDesignPath()} className="site-footer-link">
            デザインについて
          </Link>
        </nav>
        <p className="site-footer-copy">
          © {year} {LEGAL_SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
