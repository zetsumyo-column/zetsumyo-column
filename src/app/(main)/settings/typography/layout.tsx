import { ColumnFontsLayout } from "@/components/layout/column-fonts-layout";

type TypographySettingsLayoutProps = {
  children: React.ReactNode;
};

export default function TypographySettingsLayout({
  children,
}: TypographySettingsLayoutProps) {
  return <ColumnFontsLayout>{children}</ColumnFontsLayout>;
}
