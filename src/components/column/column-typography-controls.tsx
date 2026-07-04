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
  variant?: "default" | "fab";
};

export function ColumnTypographyControls({
  className,
  variant = "default",
}: ColumnTypographyControlsProps) {
  const { typography, setTypography } = useColumnTypography();
  const [mounted, setMounted] = useState(false);
  const isFab = variant === "fab";
  const optionSize = isFab ? "compact" : "default";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="muted text-sm">読み込み中...</p>;
  }

  return (
    <div
      className={
        className ??
        (isFab ? "typography-settings typography-settings-fab" : "typography-settings")
      }
    >
      <OptionGroup<ColumnFontFamily>
        label="フォント"
        options={FONT_FAMILY_OPTIONS}
        value={typography.fontFamily}
        onChange={(fontFamily) => setTypography({ ...typography, fontFamily })}
        size={optionSize}
      />
      <OptionGroup<ColumnFontSize>
        label={isFab ? "サイズ" : "文字サイズ"}
        options={FONT_SIZE_OPTIONS}
        value={typography.fontSize}
        onChange={(fontSize) => setTypography({ ...typography, fontSize })}
        size={optionSize}
      />
      <OptionGroup<ColumnLineHeight>
        label="行間"
        options={LINE_HEIGHT_OPTIONS}
        value={typography.lineHeight}
        onChange={(lineHeight) => setTypography({ ...typography, lineHeight })}
        size={optionSize}
      />
      <OptionGroup<ColumnParagraphSpacing>
        label={isFab ? "段落" : "段落の広さ"}
        options={PARAGRAPH_SPACING_OPTIONS}
        value={typography.paragraphSpacing}
        onChange={(paragraphSpacing) =>
          setTypography({ ...typography, paragraphSpacing })
        }
        size={optionSize}
      />
      <OptionGroup<ColumnLetterSpacing>
        label="字間"
        options={LETTER_SPACING_OPTIONS}
        value={typography.letterSpacing}
        onChange={(letterSpacing) =>
          setTypography({ ...typography, letterSpacing })
        }
        size={optionSize}
      />
    </div>
  );
}
