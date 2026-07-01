"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          カラーモード
        </p>
        <div className="flex gap-2">
          {THEMES.map((item) => (
            <div
              key={item.value}
              className="h-9 flex-1 rounded-full border border-zinc-300 dark:border-zinc-700"
            />
          ))}
        </div>
      </div>
    );
  }

  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        カラーモード
      </p>
      <div className="flex gap-2">
        {THEMES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTheme(item.value)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentTheme === item.value
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
