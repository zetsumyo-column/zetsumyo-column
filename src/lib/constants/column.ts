export const CHAR_LIMIT_OPTIONS = [50, 100, 140, 200] as const;

export type CharLimit = (typeof CHAR_LIMIT_OPTIONS)[number];

export const DEFAULT_CHAR_LIMIT: CharLimit = 140;

export const TITLE_MAX_LENGTH = 80;
