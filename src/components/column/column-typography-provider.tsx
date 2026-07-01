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
  DEFAULT_COLUMN_TYPOGRAPHY,
  getTypographyStyle,
  loadColumnTypography,
  saveColumnTypography,
  type ColumnTypography,
} from "@/lib/column/typography";

type ColumnTypographyContextValue = {
  typography: ColumnTypography;
  setTypography: (value: ColumnTypography) => void;
  style: ReturnType<typeof getTypographyStyle>;
};

const ColumnTypographyContext =
  createContext<ColumnTypographyContextValue | null>(null);

type ColumnTypographyProviderProps = {
  children: React.ReactNode;
};

export function ColumnTypographyProvider({
  children,
}: ColumnTypographyProviderProps) {
  const [typography, setTypographyState] = useState<ColumnTypography>(
    DEFAULT_COLUMN_TYPOGRAPHY,
  );

  useEffect(() => {
    setTypographyState(loadColumnTypography());
  }, []);

  const setTypography = useCallback((value: ColumnTypography) => {
    setTypographyState(value);
    saveColumnTypography(value);
  }, []);

  const style = useMemo(() => getTypographyStyle(typography), [typography]);

  const value = useMemo(
    () => ({ typography, setTypography, style }),
    [typography, setTypography, style],
  );

  return (
    <ColumnTypographyContext.Provider value={value}>
      {children}
    </ColumnTypographyContext.Provider>
  );
}

export function useColumnTypography(): ColumnTypographyContextValue {
  const context = useContext(ColumnTypographyContext);

  if (!context) {
    throw new Error(
      "useColumnTypography must be used within ColumnTypographyProvider",
    );
  }

  return context;
}
