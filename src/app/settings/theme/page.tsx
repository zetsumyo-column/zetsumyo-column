import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { ThemeSetting } from "@/components/theme/theme-setting";
import { BackLink } from "@/components/ui/back-link";
import { getSettingsItem } from "@/lib/settings/items";

const settingsItem = getSettingsItem("/settings/theme")!;

export default function SettingsThemePage() {
  return (
    <div className="page">
        <SettingsPageHeader
          Icon={settingsItem.Icon}
          title={settingsItem.title}
        />

        <ThemeSetting />

        <p className="mt-8 text-center">
          <BackLink href="/settings">設定に戻る</BackLink>
        </p>
    </div>
  );
}
