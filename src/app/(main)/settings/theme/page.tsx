import { SettingsPageShell } from "@/components/settings/settings-page-shell";
import { ThemeSetting } from "@/components/theme/theme-setting";

export default function SettingsThemePage() {
  return (
    <SettingsPageShell title="カラーモード">
      <ThemeSetting />
    </SettingsPageShell>
  );
}
