"use client";

import { useServerInsertedHTML } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

type ThemeContextValue = {
  theme?: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"light";if(t!=="dark")t="light";var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);}catch(e){}})();`;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);

  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  ));

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

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
