export const CONTENT_MIN_LENGTH = 70;
export const CONTENT_MAX_LENGTH = 140;
export const CHAR_LIMIT = CONTENT_MAX_LENGTH;

export const TITLE_MAX_LENGTH = 80;

export const COLUMN_STATUSES = ["draft", "published"] as const;
export type ColumnStatus = (typeof COLUMN_STATUSES)[number];

export const DRAFT_TITLE_PLACEHOLDER = "無題";
