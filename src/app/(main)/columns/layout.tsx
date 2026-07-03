import { ColumnFontsLayout } from "@/components/layout/column-fonts-layout";

type ColumnsLayoutProps = {
  children: React.ReactNode;
};

export default function ColumnsLayout({ children }: ColumnsLayoutProps) {
  return <ColumnFontsLayout>{children}</ColumnFontsLayout>;
}
