import { columnFontVariables } from "@/lib/fonts/column-fonts";

type ColumnFontsLayoutProps = {
  children: React.ReactNode;
};

export function ColumnFontsLayout({ children }: ColumnFontsLayoutProps) {
  return <div className={columnFontVariables}>{children}</div>;
}
