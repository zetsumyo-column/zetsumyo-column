"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { toggleFollow } from "@/app/actions/follow";

type FollowButtonProps = {
  targetProfileId: string;
  initialFollowing: boolean;
  isLoggedIn: boolean;
  className?: string;
};

function getFollowButtonClass(following: boolean, className?: string): string {
  const base = following ? "btn-outline" : "btn";
  return className ? `${base} ${className}` : base;
}

export function FollowButton({
  targetProfileId,
  initialFollowing,
  isLoggedIn,
  className,
}: FollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isPendingRef = useRef(false);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  if (!isLoggedIn) {
    return (
      <Link href="/login" className={getFollowButtonClass(false, className)}>
        フォロー
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={getFollowButtonClass(following, className)}
        aria-pressed={following}
        onClick={() => {
          if (isPendingRef.current) {
            return;
          }

          setError(null);

          const previousFollowing = following;
          const nextFollowing = !following;

          setFollowing(nextFollowing);
          isPendingRef.current = true;

          startTransition(async () => {
            try {
              const result = await toggleFollow(targetProfileId);

              if ("error" in result) {
                setFollowing(previousFollowing);
                setError(result.error);
                return;
              }

              setFollowing(result.isFollowing);
              router.refresh();
            } finally {
              isPendingRef.current = false;
            }
          });
        }}
      >
        {following ? "フォロー中" : "フォロー"}
      </button>
      {error && <p className="hint mt-1 font-medium text-foreground">{error}</p>}
    </>
  );
}
