"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { toggleLike } from "@/app/actions/like";

type ColumnLikeButtonProps = {
  columnId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
};

export function ColumnLikeButton({
  columnId,
  initialCount,
  initialLiked,
  isLoggedIn,
}: ColumnLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isPendingRef = useRef(false);

  useEffect(() => {
    setCount(initialCount);
    setLiked(initialLiked);
  }, [initialCount, initialLiked]);

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="like-button">
        <HeartIcon className="h-5 w-5" aria-hidden />
        <span>{count}</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={liked ? "like-button like-button-active" : "like-button"}
        aria-pressed={liked}
        aria-label={liked ? "いいねを解除" : "いいね"}
        onClick={() => {
          if (isPendingRef.current) {
            return;
          }

          setError(null);

          const previousLiked = liked;
          const previousCount = count;
          const nextLiked = !liked;
          const nextCount = nextLiked
            ? count + 1
            : Math.max(0, count - 1);

          setLiked(nextLiked);
          setCount(nextCount);
          isPendingRef.current = true;

          startTransition(async () => {
            try {
              const result = await toggleLike(columnId);

              if ("error" in result) {
                setLiked(previousLiked);
                setCount(previousCount);
                setError(result.error);
                return;
              }

              setLiked(result.liked);
            } finally {
              isPendingRef.current = false;
            }
          });
        }}
      >
        {liked ? (
          <HeartSolidIcon className="h-5 w-5" aria-hidden />
        ) : (
          <HeartIcon className="h-5 w-5" aria-hidden />
        )}
        <span>{count}</span>
      </button>
      {error && <p className="hint mt-1 font-medium text-foreground">{error}</p>}
    </>
  );
}
