"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();

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
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await toggleLike(columnId);
            if ("error" in result) {
              setError(result.error);
              return;
            }
            setLiked(result.liked);
            setCount(result.count);
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
      {error && <p className="hint mt-1 text-red-600">{error}</p>}
    </>
  );
}
