/** globals.css のカラーモード定義と対応（変更時は両方を揃える） */

import {
  DARK_CONTRAST_PRESETS,
  LIGHT_CONTRAST_PRESETS,
} from "@/lib/theme/contrast-tokens";

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
  light: LIGHT_CONTRAST_PRESETS.medium,
  dark: DARK_CONTRAST_PRESETS.medium,
} as const;

/** ライト / ダークそれぞれで主に使う zinc 段階 */
export const ZINC_PALETTE_BY_MODE = {
  light: ["zinc-50", "zinc-100", "zinc-200", "zinc-400", "zinc-500", "zinc-600", "zinc-800"],
  dark: ["zinc-300", "zinc-400", "zinc-500", "zinc-600", "zinc-700", "zinc-800", "zinc-900"],
} as const;

export type ModeColorSpec = {
  label: string;
  css: string;
  hex: string;
  tailwind?: string;
  description?: string;
};

export type ThemeModeSpec = {
  mode: "ライト" | "ダーク";
  htmlClass: "light" | "dark";
  description: string;
  background: string;
  foreground: string;
  colors: ModeColorSpec[];
};

export const THEME_LIGHT_MODE: ThemeModeSpec = {
  mode: "ライト",
  htmlClass: "light",
  description:
    "明るい背景（zinc-50）にやや暗い文字（zinc-800）を載せ、UI は zinc の中間〜暗いトーンでコントラストを作ります。",
  background: THEME_BASE_COLORS.light.background,
  foreground: THEME_BASE_COLORS.light.foreground,
  colors: [
    {
      label: "ページ背景",
      css: "--background",
      hex: THEME_BASE_COLORS.light.background,
      tailwind: "zinc-50",
      description: "body の背景。最も広い面の色です。",
    },
    {
      label: "本文テキスト",
      css: "--foreground",
      hex: THEME_BASE_COLORS.light.foreground,
      tailwind: "zinc-800",
      description: "見出し・本文など、主要な文字色です。",
    },
    {
      label: "補足テキスト",
      css: "text-zinc-500",
      hex: "#71717a",
      tailwind: "zinc-500",
      description: "ヒント、リンク、タブの非選択状態など。",
    },
    {
      label: "区切り線・ボーダー",
      css: "border-zinc-200",
      hex: "#e4e4e7",
      tailwind: "zinc-200",
      description: "入力欄、カード、リスト区切りなど。",
    },
    {
      label: "ホバー背景",
      css: "hover:bg-zinc-100",
      hex: "#f4f4f5",
      tailwind: "zinc-100",
      description: "ボタン・ナビ項目・カードリンクのホバー時。",
    },
    {
      label: "主ボタン背景",
      css: "bg-zinc-800",
      hex: "#27272a",
      tailwind: "zinc-800",
      description: "保存・公開・フォローなど主要操作のボタン。",
    },
    {
      label: "主ボタン文字",
      css: "text-zinc-50",
      hex: "#fafafa",
      tailwind: "zinc-50",
      description: "主ボタン上の文字色。",
    },
    {
      label: "浮き上がり面",
      css: "bg-zinc-50",
      hex: "#fafafa",
      tailwind: "zinc-50",
      description: "ポップアップ、FAB、メニューなど背景より一段明るい面。",
    },
    {
      label: "アラート・バナー背景",
      css: "bg-zinc-100",
      hex: "#f4f4f5",
      tailwind: "zinc-100",
      description: "エラー・警告・成功メッセージ、下書きバナーなど。",
    },
    {
      label: "アラート・バナー文字",
      css: "text-zinc-800",
      hex: "#27272a",
      tailwind: "zinc-800",
      description: "アラート・バナー内の文字色。",
    },
  ],
};

export const THEME_DARK_MODE: ThemeModeSpec = {
  mode: "ダーク",
  htmlClass: "dark",
  description:
    "やや明るい背景（zinc-800）に柔らかい文字（zinc-300）を載せ、コントラストを抑えた落ち着いた配色にしています。",
  background: THEME_BASE_COLORS.dark.background,
  foreground: THEME_BASE_COLORS.dark.foreground,
  colors: [
    {
      label: "ページ背景",
      css: "--background",
      hex: THEME_BASE_COLORS.dark.background,
      tailwind: "zinc-800",
      description: "body の背景。最も広い面の色です。",
    },
    {
      label: "本文テキスト",
      css: "--foreground",
      hex: THEME_BASE_COLORS.dark.foreground,
      tailwind: "zinc-300",
      description: "見出し・本文など、主要な文字色です。",
    },
    {
      label: "補足テキスト",
      css: "text-zinc-500",
      hex: "#71717a",
      tailwind: "zinc-500",
      description: "ヒント、リンク、タブの非選択状態など。ライトと同じ色です。",
    },
    {
      label: "区切り線・ボーダー",
      css: "border-zinc-700",
      hex: "#3f3f46",
      tailwind: "zinc-700",
      description: "入力欄、カード、リスト区切りなど。",
    },
    {
      label: "ホバー背景",
      css: "hover:bg-zinc-700",
      hex: "#3f3f46",
      tailwind: "zinc-700",
      description: "ボタン・ナビ項目・カードリンクのホバー時。",
    },
    {
      label: "主ボタン背景",
      css: "bg-zinc-600",
      hex: "#52525b",
      tailwind: "zinc-600",
      description: "保存・公開・フォローなど主要操作のボタン。",
    },
    {
      label: "主ボタン文字",
      css: "text-zinc-200",
      hex: "#e4e4e7",
      tailwind: "zinc-200",
      description: "主ボタン上の文字色。",
    },
    {
      label: "浮き上がり面",
      css: "bg-zinc-900",
      hex: "#18181b",
      tailwind: "zinc-900",
      description: "ポップアップ、FAB、メニューなど背景より一段暗い面。",
    },
    {
      label: "アラート・バナー背景",
      css: "bg-zinc-900",
      hex: "#18181b",
      tailwind: "zinc-900",
      description: "エラー・警告・成功メッセージ、下書きバナーなど。",
    },
    {
      label: "アラート・バナー文字",
      css: "text-zinc-300",
      hex: "#d4d4d8",
      tailwind: "zinc-300",
      description: "アラート・バナー内の文字色。",
    },
  ],
};

export const THEME_MODES = [THEME_LIGHT_MODE, THEME_DARK_MODE] as const;
