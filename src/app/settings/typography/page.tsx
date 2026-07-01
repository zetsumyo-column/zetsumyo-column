import { ColumnTypographySetting } from "@/components/settings/column-typography-setting";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { BackLink } from "@/components/ui/back-link";
import { getSettingsItem } from "@/lib/settings/items";

const settingsItem = getSettingsItem("/settings/typography")!;

export default function SettingsTypographyPage() {
  return (
    <div className="page">
        <SettingsPageHeader
          Icon={settingsItem.Icon}
          title={settingsItem.title}
        />

        <ColumnTypographySetting />

        <p className="mt-8 text-center">
          <BackLink href="/settings">設定に戻る</BackLink>
        </p>
    </div>
  );
}
