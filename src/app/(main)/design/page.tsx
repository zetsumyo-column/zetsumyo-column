import type { Metadata } from "next";

import { TypographySpec } from "@/components/design/typography-spec";
import { LegalDocument } from "@/components/legal/legal-document";
import { DESIGN_SECTIONS } from "@/content/design/about";

export const metadata: Metadata = {
  title: "デザインについて",
};

export default function DesignPage() {
  return (
    <div className="page">
      <LegalDocument title="デザインについて" sections={DESIGN_SECTIONS} />
      <div className="legal-document mx-auto w-full max-w-2xl">
        <TypographySpec />
      </div>
    </div>
  );
}
