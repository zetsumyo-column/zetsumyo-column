"use client";

import { useEffect, useState } from "react";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { OptionGroup } from "@/components/ui/option-group";
import {
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  PARAGRAPH_SPACING_OPTIONS,
  type ColumnFontFamily,
  type ColumnFontSize,
  type ColumnLetterSpacing,
  type ColumnLineHeight,
  type ColumnParagraphSpacing,
} from "@/lib/column/typography";

type ColumnTypographyControlsProps = {
  className?: string;
};

export function ColumnTypographyControls({
  className,
}: ColumnTypographyControlsProps) {
  const { typography, setTypography } = useColumnTypography();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="muted text-sm">読み込み中...</p>;
  }

  return (
    <div className={className ?? "typography-settings"}>
      <OptionGroup<ColumnFontFamily>
        label="フォント"
        options={FONT_FAMILY_OPTIONS}
        value={typography.fontFamily}
        onChange={(fontFamily) => setTypography({ ...typography, fontFamily })}
      />
      <OptionGroup<ColumnFontSize>
        label="文字サイズ"
        options={FONT_SIZE_OPTIONS}
        value={typography.fontSize}
        onChange={(fontSize) => setTypography({ ...typography, fontSize })}
      />
      <OptionGroup<ColumnLineHeight>
        label="行間"
        options={LINE_HEIGHT_OPTIONS}
        value={typography.lineHeight}
        onChange={(lineHeight) => setTypography({ ...typography, lineHeight })}
      />
      <OptionGroup<ColumnParagraphSpacing>
        label="段落の広さ"
        options={PARAGRAPH_SPACING_OPTIONS}
        value={typography.paragraphSpacing}
        onChange={(paragraphSpacing) =>
          setTypography({ ...typography, paragraphSpacing })
        }
      />
      <OptionGroup<ColumnLetterSpacing>
        label="字間"
        options={LETTER_SPACING_OPTIONS}
        value={typography.letterSpacing}
        onChange={(letterSpacing) =>
          setTypography({ ...typography, letterSpacing })
        }
      />
    </div>
  );
}
