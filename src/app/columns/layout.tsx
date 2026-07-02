import { columnFontVariables } from "@/lib/fonts/column-fonts";

type ColumnsLayoutProps = {
  children: React.ReactNode;
};

export default function ColumnsLayout({ children }: ColumnsLayoutProps) {
  return <div className={columnFontVariables}>{children}</div>;
}
