-- =============================================================================
-- 絶妙コラム: profiles テーブル + Auth 連動トリガー
-- Supabase Dashboard → SQL Editor でこのファイルの内容を実行してください
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. profiles テーブル
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_id text not null,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_format check (user_id ~ '^[a-zA-Z0-9_]{3,30}$'),
  constraint profiles_user_id_unique unique (user_id),
  constraint profiles_bio_max_length check (bio is null or char_length(bio) <= 200)
);

comment on table public.profiles is 'ユーザープロフィール';
comment on column public.profiles.id is 'Supabase Auth の UUID（auth.users.id と同一）';
comment on column public.profiles.user_id is 'ユーザーが設定する固有 ID（例: zetsumyo_user）';
comment on column public.profiles.display_name is '画面表示用のユーザー名';
comment on column public.profiles.bio is '自己紹介文（200文字以内）';
comment on column public.profiles.avatar_url is 'プロフィール画像 URL（初期値は Google アバター）';

-- updated_at 自動更新
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 2. 新規ユーザー登録時に profiles を自動作成
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  initial_user_id text;
  initial_display_name text;
  initial_avatar_url text;
begin
  -- Google OAuth のメタデータから初期値を取得
  initial_display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'ユーザー'
  );

  initial_avatar_url := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );

  -- 固有 ID の初期値（後からマイページで変更可能）
  initial_user_id := coalesce(
    nullif(regexp_replace(
      lower(split_part(new.email, '@', 1)),
      '[^a-z0-9_]', '_', 'g'
    ), ''),
    'user'
  ) || '_' || substr(replace(new.id::text, '-', ''), 1, 6);

  -- 30 文字制限・フォーマットに合わせて切り詰め
  initial_user_id := left(initial_user_id, 30);

  if initial_user_id !~ '^[a-zA-Z0-9_]{3,30}$' then
    initial_user_id := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  -- 衝突時はサフィックスを付与
  while exists (select 1 from public.profiles where user_id = initial_user_id) loop
    initial_user_id := 'user_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end loop;

  insert into public.profiles (id, user_id, display_name, avatar_url)
  values (new.id, initial_user_id, initial_display_name, initial_avatar_url)
  on conflict (id) do update
    set
      display_name = excluded.display_name,
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 3. 再ログイン時に Google アバターを同期（カスタム画像は上書きしない）
-- -----------------------------------------------------------------------------
create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_avatar_url text;
begin
  latest_avatar_url := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );

  update public.profiles
  set
    avatar_url = coalesce(latest_avatar_url, avatar_url),
    updated_at = now()
  where id = new.id
    and (
      avatar_url is null
      or avatar_url !~ '/storage/v1/object/public/avatars/'
    );

  return new;
end;
$$;

create trigger on_auth_user_updated
  after update on auth.users
  for each row
  execute function public.handle_user_updated();

-- -----------------------------------------------------------------------------
-- 4. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- 誰でもプロフィールを閲覧可能（コラムサービスで表示名を使う想定）
create policy "profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- 自分のプロフィールのみ更新可能
create policy "users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT はトリガー（security definer）経由のみ。直接 INSERT は不可。
