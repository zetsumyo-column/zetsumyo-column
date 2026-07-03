import type { Profile } from "@/types/database";

export const SNS_URL_MAX_LENGTH = 500;

export const SNS_PLATFORMS = [
  {
    key: "twitter",
    label: "X (Twitter)",
    formName: "sns_twitter",
    dbColumn: "sns_twitter_url",
    placeholder: "https://x.com/username",
  },
  {
    key: "instagram",
    label: "Instagram",
    formName: "sns_instagram",
    dbColumn: "sns_instagram_url",
    placeholder: "https://www.instagram.com/username",
  },
  {
    key: "tiktok",
    label: "TikTok",
    formName: "sns_tiktok",
    dbColumn: "sns_tiktok_url",
    placeholder: "https://www.tiktok.com/@username",
  },
  {
    key: "youtube",
    label: "YouTube",
    formName: "sns_youtube",
    dbColumn: "sns_youtube_url",
    placeholder: "https://www.youtube.com/@channel",
  },
  {
    key: "threads",
    label: "Threads",
    formName: "sns_threads",
    dbColumn: "sns_threads_url",
    placeholder: "https://www.threads.net/@username",
  },
  {
    key: "note",
    label: "note",
    formName: "sns_note",
    dbColumn: "sns_note_url",
    placeholder: "https://note.com/username",
  },
] as const;

export type SnsPlatformKey = (typeof SNS_PLATFORMS)[number]["key"];

export type ProfileSnsUrls = Record<SnsPlatformKey, string | null>;

export type ProfileSnsFields = Pick<
  Profile,
  | "sns_twitter_url"
  | "sns_instagram_url"
  | "sns_tiktok_url"
  | "sns_youtube_url"
  | "sns_threads_url"
  | "sns_note_url"
>;

const SNS_URL_PATTERN = /^https?:\/\/[^\s]+$/i;

export function normalizeSnsUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function parseSnsUrlInput(raw: string): string | null {
  const normalized = normalizeSnsUrlInput(raw);
  return normalized.length > 0 ? normalized : null;
}

export function validateSnsUrl(value: string, label: string): string | null {
  const normalized = normalizeSnsUrlInput(value);

  if (!normalized) {
    return null;
  }

  if (normalized.length > SNS_URL_MAX_LENGTH) {
    return `${label}のURLは${SNS_URL_MAX_LENGTH}文字以内で入力してください`;
  }

  if (!SNS_URL_PATTERN.test(normalized)) {
    return `${label}のURL形式が正しくありません（https:// から始めてください）`;
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `${label}のURL形式が正しくありません`;
    }
  } catch {
    return `${label}のURL形式が正しくありません`;
  }

  return null;
}

export function validateSnsUrls(urls: ProfileSnsUrls): string | null {
  for (const platform of SNS_PLATFORMS) {
    const value = urls[platform.key];
    if (!value) {
      continue;
    }

    const error = validateSnsUrl(value, platform.label);
    if (error) {
      return error;
    }
  }

  return null;
}

export function profileToSnsUrls(
  profile: Partial<ProfileSnsFields>,
): ProfileSnsUrls {
  return {
    twitter: profile.sns_twitter_url ?? null,
    instagram: profile.sns_instagram_url ?? null,
    tiktok: profile.sns_tiktok_url ?? null,
    youtube: profile.sns_youtube_url ?? null,
    threads: profile.sns_threads_url ?? null,
    note: profile.sns_note_url ?? null,
  };
}

export function parseSnsUrlsFromFormData(formData: FormData): ProfileSnsUrls {
  return {
    twitter: parseSnsUrlInput(String(formData.get("sns_twitter") ?? "")),
    instagram: parseSnsUrlInput(String(formData.get("sns_instagram") ?? "")),
    tiktok: parseSnsUrlInput(String(formData.get("sns_tiktok") ?? "")),
    youtube: parseSnsUrlInput(String(formData.get("sns_youtube") ?? "")),
    threads: parseSnsUrlInput(String(formData.get("sns_threads") ?? "")),
    note: parseSnsUrlInput(String(formData.get("sns_note") ?? "")),
  };
}

export function snsUrlsToDbPayload(urls: ProfileSnsUrls): ProfileSnsFields {
  return {
    sns_twitter_url: urls.twitter,
    sns_instagram_url: urls.instagram,
    sns_tiktok_url: urls.tiktok,
    sns_youtube_url: urls.youtube,
    sns_threads_url: urls.threads,
    sns_note_url: urls.note,
  };
}

export function getActiveSnsLinks(urls: ProfileSnsUrls) {
  return SNS_PLATFORMS.flatMap((platform) => {
    const url = urls[platform.key];
    return url ? [{ ...platform, url }] : [];
  });
}
