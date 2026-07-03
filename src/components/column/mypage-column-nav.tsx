"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getProfileDraftsPath,
  getProfileFeedPath,
  getProfilePublishedPath,
} from "@/lib/profile/paths";

type MypageColumnNavProps = {
  userId: string;
};

export function MypageColumnNav({ userId }: MypageColumnNavProps) {
  const pathname = usePathname();
  const items = [
    { href: getProfilePublishedPath(userId), label: "公開済み" },
    { href: getProfileDraftsPath(userId), label: "下書き" },
    { href: getProfileFeedPath(userId), label: "フォローしている人のコラム" },
  ] as const;

  return (
    <nav aria-label="自分のコラム" className="column-feed-nav mt-10">
      {items.map((item) => {
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
