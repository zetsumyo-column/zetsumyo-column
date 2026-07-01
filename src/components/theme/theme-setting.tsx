"use client";

import { useEffect, useState } from "react";

import { OptionGroup } from "@/components/ui/option-group";
import { useTheme } from "@/components/theme/theme-provider";

const THEMES = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
] as const;

export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <OptionGroup
        options={THEMES}
        value="light"
        onChange={() => {}}
      />
    );
  }

  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <OptionGroup
      options={THEMES}
      value={currentTheme}
      onChange={setTheme}
    />
  );
}
