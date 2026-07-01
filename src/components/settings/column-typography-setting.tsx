"use client";

import { useEffect, useState } from "react";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import {
  FONT_SIZE_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  PARAGRAPH_SPACING_OPTIONS,
  type ColumnFontSize,
  type ColumnLetterSpacing,
  type ColumnLineHeight,
  type ColumnParagraphSpacing,
} from "@/lib/column/typography";

function OptionButtons<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              value === option.value
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-16 rounded-full border border-zinc-300 dark:border-zinc-700"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-16 rounded-full border border-zinc-300 dark:border-zinc-700"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-16 rounded-full border border-zinc-300 dark:border-zinc-700"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-8 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-16 rounded-full border border-zinc-300 dark:border-zinc-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ColumnTypographySetting() {
  const { typography, setTypography, style } = useColumnTypography();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          コラムの文字組み
        </p>
        <SettingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          コラムの文字組み
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          コラム本文の文字サイズ・行間・段落の広さ・字間を調整できます
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <OptionButtons<ColumnFontSize>
          label="文字サイズ"
          options={FONT_SIZE_OPTIONS}
          value={typography.fontSize}
          onChange={(fontSize) => setTypography({ ...typography, fontSize })}
        />
        <OptionButtons<ColumnLineHeight>
          label="行間"
          options={LINE_HEIGHT_OPTIONS}
          value={typography.lineHeight}
          onChange={(lineHeight) =>
            setTypography({ ...typography, lineHeight })
          }
        />
        <OptionButtons<ColumnParagraphSpacing>
          label="段落の広さ"
          options={PARAGRAPH_SPACING_OPTIONS}
          value={typography.paragraphSpacing}
          onChange={(paragraphSpacing) =>
            setTypography({ ...typography, paragraphSpacing })
          }
        />
        <OptionButtons<ColumnLetterSpacing>
          label="字間"
          options={LETTER_SPACING_OPTIONS}
          value={typography.letterSpacing}
          onChange={(letterSpacing) =>
            setTypography({ ...typography, letterSpacing })
          }
        />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
        <p className="mb-2 text-xs text-zinc-500">プレビュー</p>
        <div className="column-content w-full break-words" style={style}>
          <p>絶妙な味わいのコラムを、好みの文字組みで読めます。</p>
          <p>設定はこの端末に保存され、コラム本文に反映されます。</p>
        </div>
      </div>
    </div>
  );
}
