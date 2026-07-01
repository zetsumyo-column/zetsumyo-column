"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { toggleFollow } from "@/app/actions/follow";

type FollowButtonProps = {
  targetProfileId: string;
  initialFollowing: boolean;
  isLoggedIn: boolean;
  columnId?: string;
};

export function FollowButton({
  targetProfileId,
  initialFollowing,
  isLoggedIn,
  columnId,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="btn">
        フォロー
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={following ? "btn-outline" : "btn"}
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await toggleFollow(targetProfileId, columnId);
            if ("error" in result) {
              setError(result.error);
              return;
            }
            setFollowing(result.isFollowing);
          });
        }}
      >
        {following ? "フォロー中" : "フォロー"}
      </button>
      {error && <p className="hint mt-1 text-red-600">{error}</p>}
    </div>
  );
}
