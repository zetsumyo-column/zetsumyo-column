"use client";

import { useEffect, useState } from "react";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { ColumnTitle } from "@/components/column/column-title";
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

export function ColumnTypographySetting() {
  const { typography, setTypography, style } = useColumnTypography();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="muted text-sm">読み込み中...</p>;
  }

  return (
    <div className="typography-settings">
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

      <div className="settings-preview">
        <p className="settings-preview-label">プレビュー</p>
        <article className="flex flex-col gap-6">
          <ColumnTitle>コラムの見出し</ColumnTitle>
          <div className="column-content w-full break-words" style={style}>
            <p>
              絶妙な味わいのコラムを、好みの文字組みで読めます。文字サイズや行間、段落の広さ、字間を変えると、同じ文章でも読み心地がまったく違って感じられます。
            </p>
            <p>
              設定はこの端末に保存され、コラムの見出しと本文に反映されます。長めの文章を読んでみて、目に心地よい組み方を探してみてください。
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
