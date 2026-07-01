import { BackLink } from "@/components/ui/back-link";

type SettingsPageShellProps = {
  title: string;
  children: React.ReactNode;
};

export function SettingsPageShell({ title, children }: SettingsPageShellProps) {
  return (
    <div className="page">
      <BackLink href="/settings">設定</BackLink>
      <h1 className="title mb-10 mt-3">{title}</h1>
      {children}
    </div>
  );
}
