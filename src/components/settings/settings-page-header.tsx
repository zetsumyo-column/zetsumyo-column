import type { SettingsItem } from "@/lib/settings/items";

type SettingsPageHeaderProps = Pick<SettingsItem, "Icon" | "title"> & {
  description: string;
};

export function SettingsPageHeader({
  Icon,
  title,
  description,
}: SettingsPageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="title flex items-center gap-2">
        <Icon className="h-6 w-6 shrink-0" aria-hidden />
        {title}
      </h1>
      <p className="muted mt-2">{description}</p>
    </div>
  );
}
