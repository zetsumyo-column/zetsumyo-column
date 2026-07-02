import { SettingsPageShell } from "@/components/settings/settings-page-shell";
import { DeleteAccountButton } from "@/components/settings/delete-account-button";

type SettingsAccountPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SettingsAccountPage({
  searchParams,
}: SettingsAccountPageProps) {
  const { error } = await searchParams;

  return (
    <SettingsPageShell title="アカウント">
      <section className="section">
        <h2 className="text-lg font-medium">アカウントの削除</h2>
        <p className="muted mt-2 text-sm leading-relaxed">
          アカウントを削除すると、プロフィール・公開済みコラム・下書き・いいね・フォロー関係がすべて削除されます。この操作は取り消せません。
        </p>

        {error && (
          <p className="alert-error mt-4">{decodeURIComponent(error)}</p>
        )}

        <div className="mt-6">
          <DeleteAccountButton />
        </div>
      </section>
    </SettingsPageShell>
  );
}
