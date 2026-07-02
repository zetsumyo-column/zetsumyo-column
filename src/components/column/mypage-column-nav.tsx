"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MYPAGE_COLUMN_ITEMS = [
  { href: "/mypage/published", label: "公開済み" },
  { href: "/mypage/drafts", label: "下書き" },
  { href: "/mypage/following", label: "フォローしている人のコラム" },
] as const;

export function MypageColumnNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="自分のコラム" className="column-feed-nav mt-10">
      {MYPAGE_COLUMN_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive ? "column-feed-nav-item column-feed-nav-item-active" : "column-feed-nav-item"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
