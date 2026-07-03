/** globals.css のカラーモード定義と対応（変更時は両方を揃える） */

export const THEME_STORAGE_KEY = "theme";

export type PaletteColor = {
  name: string;
  hex: string;
};

/** Tailwind zinc スケール（UI の基調色） */
export const ZINC_PALETTE: PaletteColor[] = [
  { name: "zinc-50", hex: "#fafafa" },
  { name: "zinc-100", hex: "#f4f4f5" },
  { name: "zinc-200", hex: "#e4e4e7" },
  { name: "zinc-300", hex: "#d4d4d8" },
  { name: "zinc-400", hex: "#a1a1aa" },
  { name: "zinc-500", hex: "#71717a" },
  { name: "zinc-600", hex: "#52525b" },
  { name: "zinc-700", hex: "#3f3f46" },
  { name: "zinc-800", hex: "#27272a" },
  { name: "zinc-900", hex: "#18181b" },
  { name: "zinc-950", hex: "#09090b" },
];

export const THEME_BASE_COLORS = {
  light: {
    background: "#ffffff",
    foreground: "#171717",
  },
  dark: {
    background: "#18181b",
    foreground: "#ededed",
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
    css: "--background → background-color",
    light: THEME_BASE_COLORS.light.background,
    dark: THEME_BASE_COLORS.dark.background,
  },
  {
    label: "本文テキスト",
    css: "--foreground → color",
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
    label: "本文（やや薄め）",
    css: "text-zinc-700 / dark:text-zinc-300",
    light: "#3f3f46",
    dark: "#d4d4d8",
  },
  {
    label: "区切り線・ボーダー",
    css: "border-zinc-200 / dark:border-zinc-800",
    light: "#e4e4e7",
    dark: "#27272a",
  },
  {
    label: "入力・カード枠",
    css: "border-zinc-300 / dark:border-zinc-700",
    light: "#d4d4d8",
    dark: "#3f3f46",
  },
  {
    label: "ホバー背景（薄）",
    css: "hover:bg-zinc-50 / dark:hover:bg-zinc-900/60",
    light: "#fafafa",
    dark: "rgb(24 24 27 / 0.6)",
  },
  {
    label: "ホバー背景（濃）",
    css: "hover:bg-zinc-100 / dark:hover:bg-zinc-900",
    light: "#f4f4f5",
    dark: "#18181b",
  },
  {
    label: "主ボタン背景",
    css: "bg-zinc-900 / dark:bg-zinc-100",
    light: "#18181b",
    dark: "#f4f4f5",
  },
  {
    label: "主ボタン文字",
    css: "text-white / dark:text-zinc-900",
    light: "#ffffff",
    dark: "#18181b",
  },
  {
    label: "主ボタン枠",
    css: "border-zinc-900 / dark:border-zinc-100",
    light: "#18181b",
    dark: "#f4f4f5",
  },
  {
    label: "主ボタンホバー",
    css: "hover:bg-zinc-800 / dark:hover:bg-zinc-200",
    light: "#27272a",
    dark: "#e4e4e7",
  },
  {
    label: "アバター背景",
    css: "bg-zinc-200 / dark:bg-zinc-800",
    light: "#e4e4e7",
    dark: "#27272a",
  },
  {
    label: "ポップアップ背景",
    css: "bg-white / dark:bg-zinc-950",
    light: "#ffffff",
    dark: "#09090b",
  },
  {
    label: "ポップアップヘッダー背景",
    css: "bg-zinc-50 / dark:bg-zinc-900",
    light: "#fafafa",
    dark: "#18181b",
  },
];
