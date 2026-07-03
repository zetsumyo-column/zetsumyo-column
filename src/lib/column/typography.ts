export type ColumnFontFamily = "gothic" | "mincho" | "maru" | "handwriting";
export type ColumnFontSize = "sm" | "base" | "lg" | "xl";
export type ColumnLineHeight = "tight" | "normal" | "relaxed" | "loose";
export type ColumnParagraphSpacing = "tight" | "normal" | "relaxed" | "loose";
export type ColumnLetterSpacing = "tight" | "normal" | "relaxed" | "loose";

export type ColumnTypography = {
  fontFamily: ColumnFontFamily;
  fontSize: ColumnFontSize;
  lineHeight: ColumnLineHeight;
  paragraphSpacing: ColumnParagraphSpacing;
  letterSpacing: ColumnLetterSpacing;
};

export const COLUMN_TYPOGRAPHY_STORAGE_KEY = "zetsumyo-column-typography";

export const DEFAULT_COLUMN_TYPOGRAPHY: ColumnTypography = {
  fontFamily: "gothic",
  fontSize: "sm",
  lineHeight: "relaxed",
  paragraphSpacing: "tight",
  letterSpacing: "normal",
};

export const FONT_FAMILY_OPTIONS = [
  {
    value: "gothic",
    label: "ゴシック",
    family: "var(--font-column-gothic), 'Noto Sans JP', sans-serif",
  },
  {
    value: "mincho",
    label: "明朝",
    family: "var(--font-column-mincho), 'Noto Serif JP', serif",
  },
  {
    value: "maru",
    label: "丸ゴシック",
    family: "var(--font-column-maru), 'Zen Maru Gothic', sans-serif",
  },
  {
    value: "handwriting",
    label: "手書き",
    family: "var(--font-column-handwriting), 'Zen Kurenaido', cursive",
  },
] as const satisfies ReadonlyArray<{
  value: ColumnFontFamily;
  label: string;
  family: string;
}>;

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

const FONT_FAMILY_VALUES = new Set<ColumnFontFamily>(
  FONT_FAMILY_OPTIONS.map((option) => option.value),
);
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

export const COLUMN_TITLE_FONT_SIZE_BY_BODY: Record<ColumnFontSize, string> = {
  sm: "1.125rem",
  base: "1.25rem",
  lg: "1.5rem",
  xl: "1.625rem",
};

export function getColumnTitleFontSize(fontSize: ColumnFontSize): string {
  return COLUMN_TITLE_FONT_SIZE_BY_BODY[fontSize];
}

export function getColumnTitleStyle(typography: ColumnTypography): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
} {
  const { fontFamily, lineHeight, letterSpacing } =
    getTypographyStyle(typography);

  return {
    fontFamily,
    fontSize: getColumnTitleFontSize(typography.fontSize),
    lineHeight,
    letterSpacing,
  };
}

export function getTypographyStyle(typography: ColumnTypography): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  display: "flex";
  flexDirection: "column";
  gap: string;
} {
  const fontFamily =
    FONT_FAMILY_OPTIONS.find((option) => option.value === typography.fontFamily)
      ?.family ?? FONT_FAMILY_OPTIONS[0].family;
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
    fontFamily,
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
    fontFamily: FONT_FAMILY_VALUES.has(record.fontFamily as ColumnFontFamily)
      ? (record.fontFamily as ColumnFontFamily)
      : DEFAULT_COLUMN_TYPOGRAPHY.fontFamily,
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
