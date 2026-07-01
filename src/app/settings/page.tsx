import Link from "next/link";

import { BackLink } from "@/components/ui/back-link";
import { SETTINGS_ITEMS } from "@/lib/settings/items";

export default function SettingsPage() {
  return (
    <div className="page">
        <div className="mb-8">
          <h1 className="title">設定</h1>
        </div>

        <ul className="list mt-0">
          {SETTINGS_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="settings-item">
                <item.Icon className="settings-item-icon" aria-hidden />
                <span className="text-sm">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <BackLink href="/mypage">マイページに戻る</BackLink>
        </p>
    </div>
  );
}
