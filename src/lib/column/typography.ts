export type ColumnFontSize = "sm" | "base" | "lg" | "xl";
export type ColumnLineHeight = "tight" | "normal" | "relaxed" | "loose";
export type ColumnParagraphSpacing = "tight" | "normal" | "relaxed" | "loose";
export type ColumnLetterSpacing = "tight" | "normal" | "relaxed" | "loose";

export type ColumnTypography = {
  fontSize: ColumnFontSize;
  lineHeight: ColumnLineHeight;
  paragraphSpacing: ColumnParagraphSpacing;
  letterSpacing: ColumnLetterSpacing;
};

export const COLUMN_TYPOGRAPHY_STORAGE_KEY = "zetsumyo-column-typography";

export const DEFAULT_COLUMN_TYPOGRAPHY: ColumnTypography = {
  fontSize: "sm",
  lineHeight: "relaxed",
  paragraphSpacing: "tight",
  letterSpacing: "normal",
};

export const FONT_SIZE_OPTIONS = [
  { value: "sm", label: "小", size: "0.875rem" },
  { value: "base", label: "標準", size: "1rem" },
  { value: "lg", label: "大", size: "1.125rem" },
  { value: "xl", label: "特大", size: "1.25rem" },
] as const satisfies ReadonlyArray<{
  value: ColumnFontSize;
  label: string;
  size: string;
}>;

export const LINE_HEIGHT_OPTIONS = [
  { value: "tight", label: "狭い", height: "1.5" },
  { value: "normal", label: "標準", height: "1.625" },
  { value: "relaxed", label: "広い", height: "1.75" },
  { value: "loose", label: "ゆったり", height: "2" },
] as const satisfies ReadonlyArray<{
  value: ColumnLineHeight;
  label: string;
  height: string;
}>;

export const PARAGRAPH_SPACING_OPTIONS = [
  { value: "tight", label: "狭い", spacing: "0.375rem" },
  { value: "normal", label: "標準", spacing: "0.75rem" },
  { value: "relaxed", label: "広い", spacing: "1.25rem" },
  { value: "loose", label: "ゆったり", spacing: "2rem" },
] as const satisfies ReadonlyArray<{
  value: ColumnParagraphSpacing;
  label: string;
  spacing: string;
}>;

export const LETTER_SPACING_OPTIONS = [
  { value: "tight", label: "狭い", spacing: "-0.025em" },
  { value: "normal", label: "標準", spacing: "0em" },
  { value: "relaxed", label: "広い", spacing: "0.05em" },
  { value: "loose", label: "ゆったり", spacing: "0.1em" },
] as const satisfies ReadonlyArray<{
  value: ColumnLetterSpacing;
  label: string;
  spacing: string;
}>;

const FONT_SIZE_VALUES = new Set<ColumnFontSize>(
  FONT_SIZE_OPTIONS.map((option) => option.value),
);
const LINE_HEIGHT_VALUES = new Set<ColumnLineHeight>(
  LINE_HEIGHT_OPTIONS.map((option) => option.value),
);
const PARAGRAPH_SPACING_VALUES = new Set<ColumnParagraphSpacing>(
  PARAGRAPH_SPACING_OPTIONS.map((option) => option.value),
);
const LETTER_SPACING_VALUES = new Set<ColumnLetterSpacing>(
  LETTER_SPACING_OPTIONS.map((option) => option.value),
);

export function getTypographyStyle(typography: ColumnTypography): {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  display: "flex";
  flexDirection: "column";
  gap: string;
} {
  const fontSize =
    FONT_SIZE_OPTIONS.find((option) => option.value === typography.fontSize)
      ?.size ?? FONT_SIZE_OPTIONS[0].size;
  const lineHeight =
    LINE_HEIGHT_OPTIONS.find((option) => option.value === typography.lineHeight)
      ?.height ?? LINE_HEIGHT_OPTIONS[2].height;
  const paragraphSpacing =
    PARAGRAPH_SPACING_OPTIONS.find(
      (option) => option.value === typography.paragraphSpacing,
    )?.spacing ?? PARAGRAPH_SPACING_OPTIONS[0].spacing;
  const letterSpacing =
    LETTER_SPACING_OPTIONS.find(
      (option) => option.value === typography.letterSpacing,
    )?.spacing ?? LETTER_SPACING_OPTIONS[1].spacing;

  return {
    fontSize,
    lineHeight,
    letterSpacing,
    display: "flex",
    flexDirection: "column",
    gap: paragraphSpacing,
  };
}

function normalizeTypography(value: unknown): ColumnTypography {
  if (!value || typeof value !== "object") {
    return DEFAULT_COLUMN_TYPOGRAPHY;
  }

  const record = value as Record<string, unknown>;

  return {
    fontSize: FONT_SIZE_VALUES.has(record.fontSize as ColumnFontSize)
      ? (record.fontSize as ColumnFontSize)
      : DEFAULT_COLUMN_TYPOGRAPHY.fontSize,
    lineHeight: LINE_HEIGHT_VALUES.has(record.lineHeight as ColumnLineHeight)
      ? (record.lineHeight as ColumnLineHeight)
      : DEFAULT_COLUMN_TYPOGRAPHY.lineHeight,
    paragraphSpacing: PARAGRAPH_SPACING_VALUES.has(
      record.paragraphSpacing as ColumnParagraphSpacing,
    )
      ? (record.paragraphSpacing as ColumnParagraphSpacing)
      : DEFAULT_COLUMN_TYPOGRAPHY.paragraphSpacing,
    letterSpacing: LETTER_SPACING_VALUES.has(
      record.letterSpacing as ColumnLetterSpacing,
    )
      ? (record.letterSpacing as ColumnLetterSpacing)
      : DEFAULT_COLUMN_TYPOGRAPHY.letterSpacing,
  };
}

export function loadColumnTypography(): ColumnTypography {
  if (typeof window === "undefined") {
    return DEFAULT_COLUMN_TYPOGRAPHY;
  }

  try {
    const stored = window.localStorage.getItem(COLUMN_TYPOGRAPHY_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_COLUMN_TYPOGRAPHY;
    }

    const parsed: unknown = JSON.parse(stored);
    return normalizeTypography(parsed);
  } catch {
    // ignore invalid storage
  }

  return DEFAULT_COLUMN_TYPOGRAPHY;
}

export function saveColumnTypography(typography: ColumnTypography): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    COLUMN_TYPOGRAPHY_STORAGE_KEY,
    JSON.stringify(typography),
  );
}
