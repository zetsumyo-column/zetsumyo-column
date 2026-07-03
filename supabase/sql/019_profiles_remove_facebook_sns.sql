-- =============================================================================
-- profiles から Facebook SNS リンク列を削除
-- 018 を実行済みの環境向け
-- =============================================================================

alter table public.profiles
  drop constraint if exists profiles_sns_facebook_url_valid;

alter table public.profiles
  drop column if exists sns_facebook_url;
