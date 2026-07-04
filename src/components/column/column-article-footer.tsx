import Image from "next/image";
import Link from "next/link";

import { ColumnLikeButton } from "@/components/column/column-like-button";
import { ColumnViewTracker } from "@/components/column/column-view-tracker";
import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { FollowButton } from "@/components/profile/follow-button";
import { formatDate } from "@/lib/format-date";
import { getAvatarInitial } from "@/lib/profile/avatar";
import { getProfilePath } from "@/lib/profile/paths";
import type { Profile } from "@/types/database";

type ColumnArticleFooterProps = {
  author: Pick<Profile, "user_id" | "display_name" | "avatar_url" | "bio">;
  authorId: string;
  columnId: string;
  createdAt: string;
  plainTextLength: number;
  isDraft: boolean;
  isLoggedIn: boolean;
  isOwner: boolean;
  viewCount?: number;
  recordView?: boolean;
  likeCount?: number;
  liked?: boolean;
  isFollowing?: boolean;
};

export function ColumnArticleFooter({
  author,
  authorId,
  columnId,
  createdAt,
  plainTextLength,
  isDraft,
  isLoggedIn,
  isOwner,
  viewCount = 0,
  recordView = false,
  likeCount = 0,
  liked = false,
  isFollowing = false,
}: ColumnArticleFooterProps) {
  return (
    <footer className="column-footer">
      <p className="hint">
        <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        <span className="mx-1.5">·</span>
        <span>{plainTextLength}文字</span>
        {!isDraft && (
          <>
            <span className="mx-1.5">·</span>
            <ColumnViewTracker
              columnId={columnId}
              initialViewCount={viewCount}
              recordView={recordView}
            />
          </>
        )}
      </p>

      {!isDraft && (
        <ColumnLikeButton
          columnId={columnId}
          initialCount={likeCount}
          initialLiked={liked}
          isLoggedIn={isLoggedIn}
        />
      )}

      <div className="flex items-start justify-between gap-3 pt-2">
        <Link
          href={getProfilePath(author.user_id)}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.display_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="avatar h-10 w-10 text-sm">
              {getAvatarInitial(author.display_name, author.user_id)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{author.display_name}</p>
            <p className="hint truncate">@{author.user_id}</p>
          </div>
        </Link>

        {!isOwner && (
          <FollowButton
            targetProfileId={authorId}
            initialFollowing={isFollowing}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      {author.bio && (
        <p className="whitespace-pre-wrap text-sm">{author.bio}</p>
      )}

      {isOwner && !isDraft && (
        <div className="pt-4">
          <DeleteColumnButton columnId={columnId} isPublished />
        </div>
      )}
    </footer>
  );
}
