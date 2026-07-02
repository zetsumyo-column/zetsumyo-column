import { columnFontVariables } from "@/lib/fonts/column-fonts";

type TypographySettingsLayoutProps = {
  children: React.ReactNode;
};

export default function TypographySettingsLayout({
  children,
}: TypographySettingsLayoutProps) {
  return <div className={columnFontVariables}>{children}</div>;
}
