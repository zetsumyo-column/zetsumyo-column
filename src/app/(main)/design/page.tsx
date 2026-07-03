import type { Metadata } from "next";

import { ColorModeSpec } from "@/components/design/color-mode-spec";
import { TypographySpec } from "@/components/design/typography-spec";
import { UiPartsSpec } from "@/components/design/ui-parts-spec";
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
        <ColorModeSpec />
        <UiPartsSpec />
        <TypographySpec />
      </div>
    </div>
  );
}
