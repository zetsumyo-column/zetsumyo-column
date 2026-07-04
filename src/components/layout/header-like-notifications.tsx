"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { fetchLikeNotifications } from "@/app/actions/like-notifications";
import { getColumnPath } from "@/lib/column/paths";
import type { LikeNotification } from "@/lib/column/like-notifications";
import { formatDate } from "@/lib/format-date";
import { getAvatarInitial } from "@/lib/profile/avatar";

type HeaderLikeNotificationsProps = {
  authorUserId: string;
};

export function HeaderLikeNotifications({
  authorUserId,
}: HeaderLikeNotificationsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<LikeNotification[] | null>(
    null,
  );
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

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadNotifications() {
      setLoading(true);
      setError(null);

      const result = await fetchLikeNotifications();

      if (cancelled) {
        return;
      }

      if ("error" in result) {
        setError(result.error);
        setNotifications([]);
      } else {
        setNotifications(result.notifications);
      }

      setLoading(false);
    }

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <div className="header-notifications" ref={menuRef}>
      <button
        type="button"
        className={
          open
            ? "header-notifications-trigger header-notifications-trigger-open"
            : "header-notifications-trigger"
        }
        aria-label="いいね通知"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <BellIcon className="header-notifications-icon" aria-hidden />
      </button>

      {open && (
        <div
          className="header-notifications-popup"
          role="dialog"
          aria-label="いいね通知"
        >
          <div className="header-notifications-head">
            <span className="text-sm font-medium">いいね</span>
          </div>

          <div className="header-notifications-body">
            {loading && (
              <p className="header-notifications-empty">読み込み中...</p>
            )}

            {!loading && error && (
              <p className="header-notifications-empty">{error}</p>
            )}

            {!loading && !error && notifications?.length === 0 && (
              <p className="header-notifications-empty">
                まだいいねはありません
              </p>
            )}

            {!loading && !error && notifications && notifications.length > 0 && (
              <ul className="header-notifications-list">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <Link
                      href={getColumnPath(
                        authorUserId,
                        notification.column.publicId,
                      )}
                      className="header-notifications-item"
                      onClick={() => setOpen(false)}
                    >
                      <NotificationAvatar notification={notification} />
                      <div className="min-w-0 flex-1">
                        <p className="header-notifications-text">
                          <span className="font-medium">
                            {notification.liker.displayName}
                          </span>
                          <span> さんが、</span>
                          <span className="font-medium">
                            {notification.column.title}
                          </span>
                          <span> にいいねしました</span>
                        </p>
                        <time
                          className="header-notifications-date"
                          dateTime={notification.createdAt}
                        >
                          {formatDate(notification.createdAt)}
                        </time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationAvatar({
  notification,
}: {
  notification: LikeNotification;
}) {
  const { liker } = notification;

  if (liker.avatarUrl) {
    return (
      <Image
        src={liker.avatarUrl}
        alt={liker.displayName}
        width={32}
        height={32}
        className="header-notifications-avatar shrink-0 rounded-full"
      />
    );
  }

  return (
    <div className="avatar header-notifications-avatar shrink-0 text-xs">
      {getAvatarInitial(liker.displayName, liker.userId)}
    </div>
  );
}
