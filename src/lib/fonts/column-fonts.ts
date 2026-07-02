import {
  Noto_Sans_JP,
  Noto_Serif_JP,
  Zen_Kurenaido,
  Zen_Maru_Gothic,
} from "next/font/google";

export const columnFontGothic = Noto_Sans_JP({
  variable: "--font-column-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const columnFontMincho = Noto_Serif_JP({
  variable: "--font-column-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const columnFontMaru = Zen_Maru_Gothic({
  variable: "--font-column-maru",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const columnFontHandwriting = Zen_Kurenaido({
  variable: "--font-column-handwriting",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const columnFontVariables = [
  columnFontGothic.variable,
  columnFontMincho.variable,
  columnFontMaru.variable,
  columnFontHandwriting.variable,
].join(" ");
