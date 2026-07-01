"use client";

import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";

import { signOut } from "@/app/actions/auth";
import { getAvatarInitial } from "@/lib/profile/avatar";

type HeaderUserMenuProps = {
  avatarUrl: string | null;
  displayName: string;
  userId: string;
};

type MenuItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const MENU_ITEMS = (userId: string): MenuItem[] => [
  { href: "/mypage", label: "プロフィール", Icon: UserIcon },
  { href: `/users/${userId}/following`, label: "フォロー", Icon: UserPlusIcon },
  { href: `/users/${userId}/followers`, label: "フォロワー", Icon: UserGroupIcon },
  { href: "/settings", label: "設定", Icon: Cog6ToothIcon },
];

export function HeaderUserMenu({
  avatarUrl,
  displayName,
  userId,
}: HeaderUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="header-menu" ref={menuRef}>
      <button
        type="button"
        className={open ? "header-menu-trigger header-menu-trigger-open" : "header-menu-trigger"}
        aria-label="メニュー"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="avatar h-10 w-10 text-sm">
            {getAvatarInitial(displayName, userId)}
          </div>
        )}
      </button>

      {open && (
        <div className="header-menu-popup" role="menu" aria-label="ユーザーメニュー">
          <div className="header-menu-head">
            <p className="truncate text-sm font-medium">{displayName || userId}</p>
            <p className="hint mt-0.5 truncate">@{userId}</p>
          </div>

          <nav className="header-menu-list">
            {MENU_ITEMS(userId).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="header-menu-item"
                onClick={() => setOpen(false)}
              >
                <item.Icon className="header-menu-icon" aria-hidden />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="header-menu-divider" />

          <nav className="header-menu-list">
            <Link
              href="/columns/new"
              role="menuitem"
              className="header-menu-item"
              onClick={() => setOpen(false)}
            >
              <PencilSquareIcon className="header-menu-icon" aria-hidden />
              <span>投稿</span>
            </Link>
            <form action={signOut}>
              <button type="submit" role="menuitem" className="header-menu-item w-full">
                <ArrowRightOnRectangleIcon className="header-menu-icon" aria-hidden />
                <span>ログアウト</span>
              </button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
}
