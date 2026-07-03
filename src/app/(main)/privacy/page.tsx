import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY_SECTIONS } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <LegalDocument title="プライバシーポリシー" sections={PRIVACY_SECTIONS} />
    </div>
  );
}
