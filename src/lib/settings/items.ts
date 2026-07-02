import {
  Bars3BottomLeftIcon,
  ExclamationTriangleIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type SettingsItem = {
  href: string;
  title: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const SETTINGS_ITEMS: SettingsItem[] = [
  {
    href: "/settings/profile",
    title: "プロフィール",
    Icon: UserIcon,
  },
  {
    href: "/settings/theme",
    title: "カラーモード",
    Icon: SunIcon,
  },
  {
    href: "/settings/typography",
    title: "文字組み",
    Icon: Bars3BottomLeftIcon,
  },
  {
    href: "/settings/account",
    title: "アカウント",
    Icon: ExclamationTriangleIcon,
  },
];

export function getSettingsItem(href: string): SettingsItem | undefined {
  return SETTINGS_ITEMS.find((item) => item.href === href);
}
