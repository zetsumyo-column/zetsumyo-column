import { ColumnTypographySetting } from "@/components/settings/column-typography-setting";
import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export default function SettingsTypographyPage() {
  return (
    <SettingsPageShell title="文字組み">
      <ColumnTypographySetting />
    </SettingsPageShell>
  );
}
