"use client";

import { useColumnTypography } from "@/components/column/column-typography-provider";
import { getColumnTitleStyle } from "@/lib/column/typography";

type ColumnTitleProps = {
  children: React.ReactNode;
};

export function ColumnTitle({ children }: ColumnTitleProps) {
  const { typography } = useColumnTypography();

  return <h1 style={getColumnTitleStyle(typography)}>{children}</h1>;
}
