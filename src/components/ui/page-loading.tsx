export function PageLoading() {
  return (
    <div className="page" aria-busy="true" aria-label="読み込み中">
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border-b border-dashed border-zinc-200 py-6 first:border-t dark:border-zinc-800"
            >
              <div className="h-5 w-3/4 max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MypageLoading() {
  return (
    <div aria-busy="true" aria-label="読み込み中">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-7 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-4 w-56 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
      <div className="column-feed-nav mt-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-24 animate-pulse rounded-t-md bg-zinc-100 dark:bg-zinc-900"
          />
        ))}
      </div>
      <div className="mt-2 space-y-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-dashed border-zinc-200 py-6 first:border-t dark:border-zinc-800"
          >
            <div className="h-5 w-2/3 max-w-sm animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColumnDetailLoading() {
  return (
    <div className="page" aria-busy="true" aria-label="読み込み中">
      <div className="space-y-6">
        <div className="h-9 w-full max-w-lg animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900"
              style={{ width: `${88 - (index % 3) * 12}%` }}
            />
          ))}
        </div>
        <div className="h-16 w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
