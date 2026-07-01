-- プロフィールに自己紹介文を追加
alter table public.profiles
  add column if not exists bio text;

alter table public.profiles
  drop constraint if exists profiles_bio_max_length;

alter table public.profiles
  add constraint profiles_bio_max_length check (bio is null or char_length(bio) <= 200);

comment on column public.profiles.bio is '自己紹介文（200文字以内）';
