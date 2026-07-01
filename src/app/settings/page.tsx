import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { SETTINGS_ITEMS } from "@/lib/settings/items";

export default function SettingsPage() {
  return (
    <div className="page">
      <h1 className="title">設定</h1>

      <nav aria-label="設定メニュー">
        <ul className="settings-nav">
          {SETTINGS_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="settings-nav-item">
                <item.Icon className="settings-nav-icon" aria-hidden />
                <span>{item.title}</span>
                <ChevronRightIcon className="settings-nav-chevron" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
