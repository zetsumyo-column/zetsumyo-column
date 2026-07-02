"use client";

import { useEffect, useState } from "react";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { ColumnTypographyControls } from "@/components/column/column-typography-controls";
import { ColumnTitle } from "@/components/column/column-title";

export function ColumnTypographySetting() {
  const { style } = useColumnTypography();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="muted text-sm">読み込み中...</p>;
  }

  return (
    <div className="typography-settings">
      <ColumnTypographyControls />

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
