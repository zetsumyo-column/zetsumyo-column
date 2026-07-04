import { ColumnFontsLayout } from "@/components/layout/column-fonts-layout";

type ColumnArticleLayoutProps = {
  children: React.ReactNode;
};

export default function ColumnArticleLayout({ children }: ColumnArticleLayoutProps) {
  return <ColumnFontsLayout>{children}</ColumnFontsLayout>;
}
