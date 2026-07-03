-- =============================================================================
-- profiles に SNS リンク列を追加
-- =============================================================================

create or replace function public.is_valid_sns_url(url text)
returns boolean
language sql
immutable
as $$
  select url is null or (
    char_length(url) between 1 and 500
    and url ~ '^https?://[^\s]+$'
  );
$$;

alter table public.profiles
  add column if not exists sns_twitter_url text,
  add column if not exists sns_instagram_url text,
  add column if not exists sns_tiktok_url text,
  add column if not exists sns_youtube_url text,
  add column if not exists sns_threads_url text,
  add column if not exists sns_note_url text;

alter table public.profiles
  drop constraint if exists profiles_sns_twitter_url_valid,
  drop constraint if exists profiles_sns_instagram_url_valid,
  drop constraint if exists profiles_sns_tiktok_url_valid,
  drop constraint if exists profiles_sns_youtube_url_valid,
  drop constraint if exists profiles_sns_threads_url_valid,
  drop constraint if exists profiles_sns_note_url_valid;

alter table public.profiles
  add constraint profiles_sns_twitter_url_valid
    check (public.is_valid_sns_url(sns_twitter_url)),
  add constraint profiles_sns_instagram_url_valid
    check (public.is_valid_sns_url(sns_instagram_url)),
  add constraint profiles_sns_tiktok_url_valid
    check (public.is_valid_sns_url(sns_tiktok_url)),
  add constraint profiles_sns_youtube_url_valid
    check (public.is_valid_sns_url(sns_youtube_url)),
  add constraint profiles_sns_threads_url_valid
    check (public.is_valid_sns_url(sns_threads_url)),
  add constraint profiles_sns_note_url_valid
    check (public.is_valid_sns_url(sns_note_url));

comment on column public.profiles.sns_twitter_url is 'X (Twitter) プロフィール URL';
comment on column public.profiles.sns_instagram_url is 'Instagram プロフィール URL';
comment on column public.profiles.sns_tiktok_url is 'TikTok プロフィール URL';
comment on column public.profiles.sns_youtube_url is 'YouTube チャンネル URL';
comment on column public.profiles.sns_threads_url is 'Threads プロフィール URL';
comment on column public.profiles.sns_note_url is 'note プロフィール URL';
