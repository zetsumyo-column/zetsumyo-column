/** globals.css の .contrast-* 定義と対応（変更時は両方を揃える） */

export const THEME_CONTRAST_STORAGE_KEY = "theme-contrast";

/** @deprecated 旧キー（読み込み時のフォールバックのみ） */
export const THEME_CONTRAST_LIGHT_STORAGE_KEY = "theme-contrast-light";

/** @deprecated 旧キー（読み込み時のフォールバックのみ） */
export const THEME_CONTRAST_DARK_STORAGE_KEY = "theme-contrast-dark";

export const CONTRAST_LEVELS = ["low", "medium", "high"] as const;

export type ContrastLevel = (typeof CONTRAST_LEVELS)[number];

export type ContrastPreset = {
  background: string;
  foreground: string;
};

export const CONTRAST_LEVEL_OPTIONS: ReadonlyArray<{
  value: ContrastLevel;
  label: string;
  description: string;
}> = [
  {
    value: "low",
    label: "低",
    description: "背景と文字の差を小さくし、目にやさしい表示にします。",
  },
  {
    value: "medium",
    label: "標準",
    description: "読みやすさと落ち着きのバランスを取った初期設定です。",
  },
  {
    value: "high",
    label: "高",
    description: "背景と文字の差を大きくし、はっきり読める表示にします。",
  },
];

export const LIGHT_CONTRAST_PRESETS: Record<ContrastLevel, ContrastPreset> = {
  low: {
    background: "#f4f4f5",
    foreground: "#52525b",
  },
  medium: {
    background: "#fafafa",
    foreground: "#27272a",
  },
  high: {
    background: "#fafafa",
    foreground: "#18181b",
  },
};

export const DARK_CONTRAST_PRESETS: Record<ContrastLevel, ContrastPreset> = {
  low: {
    background: "#27272a",
    foreground: "#71717a",
  },
  medium: {
    background: "#27272a",
    foreground: "#d4d4d8",
  },
  high: {
    background: "#18181b",
    foreground: "#e4e4e7",
  },
};

export function isContrastLevel(value: string | null | undefined): value is ContrastLevel {
  return value === "low" || value === "medium" || value === "high";
}

export function parseContrastLevel(value: string | null | undefined): ContrastLevel {
  return isContrastLevel(value) ? value : "medium";
}

export function getContrastPreset(
  theme: "light" | "dark",
  level: ContrastLevel,
): ContrastPreset {
  return theme === "dark"
    ? DARK_CONTRAST_PRESETS[level]
    : LIGHT_CONTRAST_PRESETS[level];
}

export function contrastClassName(level: ContrastLevel): string {
  return `contrast-${level}`;
}

export function readStoredContrast(): ContrastLevel {
  if (typeof window === "undefined") {
    return "medium";
  }

  const unified = localStorage.getItem(THEME_CONTRAST_STORAGE_KEY);
  if (isContrastLevel(unified)) {
    return unified;
  }

  const legacyLight = localStorage.getItem(THEME_CONTRAST_LIGHT_STORAGE_KEY);
  if (isContrastLevel(legacyLight)) {
    return legacyLight;
  }

  const legacyDark = localStorage.getItem(THEME_CONTRAST_DARK_STORAGE_KEY);
  if (isContrastLevel(legacyDark)) {
    return legacyDark;
  }

  return "medium";
}

export function applyThemeClasses(
  theme: "light" | "dark",
  contrast: ContrastLevel,
): void {
  const root = document.documentElement;

  root.classList.remove(
    "light",
    "dark",
    "contrast-low",
    "contrast-medium",
    "contrast-high",
  );
  root.classList.add(theme, contrastClassName(contrast));
}

export function persistContrast(contrast: ContrastLevel): void {
  localStorage.setItem(THEME_CONTRAST_STORAGE_KEY, contrast);
  localStorage.removeItem(THEME_CONTRAST_LIGHT_STORAGE_KEY);
  localStorage.removeItem(THEME_CONTRAST_DARK_STORAGE_KEY);
}
