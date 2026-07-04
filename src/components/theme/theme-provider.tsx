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
  readStoredContrastDark,
  readStoredContrastLight,
  THEME_CONTRAST_DARK_STORAGE_KEY,
  THEME_CONTRAST_LIGHT_STORAGE_KEY,
  type ContrastLevel,
} from "@/lib/theme/contrast-tokens";
import { THEME_STORAGE_KEY } from "@/lib/theme/init-script";

const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

type ThemeContextValue = {
  theme?: Theme;
  contrastLight?: ContrastLevel;
  contrastDark?: ContrastLevel;
  setTheme: (theme: Theme) => void;
  setContrastLight: (level: ContrastLevel) => void;
  setContrastDark: (level: ContrastLevel) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function persistAndApply(
  theme: Theme,
  contrastLight: ContrastLevel,
  contrastDark: ContrastLevel,
): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.setItem(THEME_CONTRAST_LIGHT_STORAGE_KEY, contrastLight);
  localStorage.setItem(THEME_CONTRAST_DARK_STORAGE_KEY, contrastDark);
  applyThemeClasses(theme, contrastLight, contrastDark);
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);
  const [contrastLight, setContrastLightState] = useState<
    ContrastLevel | undefined
  >(undefined);
  const [contrastDark, setContrastDarkState] = useState<
    ContrastLevel | undefined
  >(undefined);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const storedContrastLight = readStoredContrastLight();
    const storedContrastDark = readStoredContrastDark();

    setThemeState(storedTheme);
    setContrastLightState(storedContrastLight);
    setContrastDarkState(storedContrastDark);
    applyThemeClasses(storedTheme, storedContrastLight, storedContrastDark);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      const cl = contrastLight ?? readStoredContrastLight();
      const cd = contrastDark ?? readStoredContrastDark();
      persistAndApply(next, cl, cd);
    },
    [contrastDark, contrastLight],
  );

  const setContrastLight = useCallback(
    (level: ContrastLevel) => {
      setContrastLightState(level);
      const currentTheme = theme ?? readStoredTheme();
      const cd = contrastDark ?? readStoredContrastDark();
      persistAndApply(currentTheme, level, cd);
    },
    [contrastDark, theme],
  );

  const setContrastDark = useCallback(
    (level: ContrastLevel) => {
      setContrastDarkState(level);
      const currentTheme = theme ?? readStoredTheme();
      const cl = contrastLight ?? readStoredContrastLight();
      persistAndApply(currentTheme, cl, level);
    },
    [contrastLight, theme],
  );

  const value = useMemo(
    () => ({
      theme,
      contrastLight,
      contrastDark,
      setTheme,
      setContrastLight,
      setContrastDark,
    }),
    [contrastDark, contrastLight, setContrastDark, setContrastLight, setTheme, theme],
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
