"use client";

import { useEffect, useRef, useState } from "react";

import { recordColumnView } from "@/app/actions/view";

type ColumnViewTrackerProps = {
  columnId: string;
  initialViewCount: number;
  recordView: boolean;
};

export function ColumnViewTracker({
  columnId,
  initialViewCount,
  recordView,
}: ColumnViewTrackerProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const recordedRef = useRef(false);

  useEffect(() => {
    setViewCount(initialViewCount);
  }, [initialViewCount]);

  useEffect(() => {
    if (!recordView || recordedRef.current) {
      return;
    }

    const recordedKey = `column_viewed_${columnId}`;
    if (sessionStorage.getItem(recordedKey)) {
      return;
    }

    recordedRef.current = true;
    sessionStorage.setItem(recordedKey, "1");

    void recordColumnView(columnId).then((result) => {
      if ("viewCount" in result) {
        setViewCount(result.viewCount);
      }
    });
  }, [columnId, recordView]);

  return <span>{viewCount.toLocaleString("ja-JP")}回読まれました</span>;
}
