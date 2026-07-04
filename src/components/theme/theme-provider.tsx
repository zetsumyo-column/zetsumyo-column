"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  applyThemeClasses,
  persistContrast,
  readStoredContrast,
  type ContrastLevel,
} from "@/lib/theme/contrast-tokens";
import { THEME_STORAGE_KEY } from "@/lib/theme/init-script";

const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

type ThemeContextValue = {
  theme?: Theme;
  contrast?: ContrastLevel;
  setTheme: (theme: Theme) => void;
  setContrast: (level: ContrastLevel) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function persistAndApply(theme: Theme, contrast: ContrastLevel): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  persistContrast(contrast);
  applyThemeClasses(theme, contrast);
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);
  const [contrast, setContrastState] = useState<ContrastLevel | undefined>(
    undefined,
  );

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const storedContrast = readStoredContrast();

    setThemeState(storedTheme);
    setContrastState(storedContrast);
    applyThemeClasses(storedTheme, storedContrast);
    persistContrast(storedContrast);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      const level = contrast ?? readStoredContrast();
      persistAndApply(next, level);
    },
    [contrast],
  );

  const setContrast = useCallback(
    (level: ContrastLevel) => {
      setContrastState(level);
      const currentTheme = theme ?? readStoredTheme();
      persistAndApply(currentTheme, level);
    },
    [theme],
  );

  const value = useMemo(
    () => ({
      theme,
      contrast,
      setTheme,
      setContrast,
    }),
    [contrast, setContrast, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
