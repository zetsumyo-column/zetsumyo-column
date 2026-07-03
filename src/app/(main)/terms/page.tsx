import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS_SECTIONS } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <div className="page">
      <LegalDocument title="利用規約" sections={TERMS_SECTIONS} />
    </div>
  );
}
