export const CONTENT_MIN_LENGTH = 700;
export const CONTENT_MAX_LENGTH = 1400;

export const TITLE_MIN_LENGTH = 10;
export const TITLE_MAX_LENGTH = 30;

export const COLUMN_STATUSES = ["draft", "published"] as const;
export type ColumnStatus = (typeof COLUMN_STATUSES)[number];

export const DRAFT_TITLE_PLACEHOLDER = "無題";
