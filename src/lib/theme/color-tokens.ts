/** globals.css のカラーモード定義と対応（変更時は両方を揃える） */

export const THEME_STORAGE_KEY = "theme";

export type PaletteColor = {
  name: string;
  hex: string;
};

/** サービスで使う zinc スケール（#fff / #000 は使わない） */
export const ZINC_PALETTE: PaletteColor[] = [
  { name: "zinc-50", hex: "#fafafa" },
  { name: "zinc-100", hex: "#f4f4f5" },
  { name: "zinc-200", hex: "#e4e4e7" },
  { name: "zinc-400", hex: "#a1a1aa" },
  { name: "zinc-500", hex: "#71717a" },
  { name: "zinc-600", hex: "#52525b" },
  { name: "zinc-800", hex: "#27272a" },
  { name: "zinc-900", hex: "#18181b" },
  { name: "zinc-950", hex: "#09090b" },
];

export const THEME_BASE_COLORS = {
  light: {
    background: "#fafafa",
    foreground: "#27272a",
  },
  dark: {
    background: "#18181b",
    foreground: "#e4e4e7",
  },
} as const;

export const THEME_BASE_PALETTE: Array<{
  mode: "ライト" | "ダーク";
  background: string;
  foreground: string;
}> = [
  {
    mode: "ライト",
    background: THEME_BASE_COLORS.light.background,
    foreground: THEME_BASE_COLORS.light.foreground,
  },
  {
    mode: "ダーク",
    background: THEME_BASE_COLORS.dark.background,
    foreground: THEME_BASE_COLORS.dark.foreground,
  },
];

export type ColorModeToken = {
  label: string;
  css: string;
  light: string;
  dark: string;
};

export const THEME_BASE_COLOR_TOKENS: ColorModeToken[] = [
  {
    label: "ページ背景",
    css: "--background",
    light: THEME_BASE_COLORS.light.background,
    dark: THEME_BASE_COLORS.dark.background,
  },
  {
    label: "本文テキスト",
    css: "--foreground",
    light: THEME_BASE_COLORS.light.foreground,
    dark: THEME_BASE_COLORS.dark.foreground,
  },
];

export const THEME_UI_COLOR_TOKENS: ColorModeToken[] = [
  {
    label: "補足テキスト",
    css: "text-zinc-500",
    light: "#71717a",
    dark: "#71717a",
  },
  {
    label: "区切り線・ボーダー",
    css: "border-zinc-200 / dark:border-zinc-800",
    light: "#e4e4e7",
    dark: "#27272a",
  },
  {
    label: "ホバー背景",
    css: "hover:bg-zinc-100 / dark:hover:bg-zinc-800",
    light: "#f4f4f5",
    dark: "#27272a",
  },
  {
    label: "主ボタン背景",
    css: "bg-zinc-800 / dark:bg-zinc-200",
    light: "#27272a",
    dark: "#e4e4e7",
  },
  {
    label: "主ボタン文字",
    css: "text-zinc-50 / dark:text-zinc-900",
    light: "#fafafa",
    dark: "#18181b",
  },
  {
    label: "浮き上がり面",
    css: "bg-zinc-50 / dark:bg-zinc-950",
    light: "#fafafa",
    dark: "#09090b",
  },
  {
    label: "アラート・バナー",
    css: "bg-zinc-100 text-zinc-800 / dark:bg-zinc-900 dark:text-zinc-200",
    light: "#f4f4f5",
    dark: "#18181b",
  },
];
