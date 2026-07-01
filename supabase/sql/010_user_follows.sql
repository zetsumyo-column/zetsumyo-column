-- ユーザーフォロー
create table if not exists public.user_follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_follows_unique unique (follower_id, following_id),
  constraint user_follows_no_self_follow check (follower_id <> following_id)
);

comment on table public.user_follows is 'ユーザーフォロー';

create index if not exists user_follows_following_id_idx
  on public.user_follows (following_id);

create index if not exists user_follows_follower_id_idx
  on public.user_follows (follower_id);

alter table public.user_follows enable row level security;

drop policy if exists "user follows are viewable by everyone" on public.user_follows;

create policy "user follows are viewable by everyone"
  on public.user_follows
  for select
  using (true);

drop policy if exists "authenticated users can follow others" on public.user_follows;

create policy "authenticated users can follow others"
  on public.user_follows
  for insert
  to authenticated
  with check (
    auth.uid() = follower_id
    and follower_id <> following_id
  );

drop policy if exists "users can unfollow" on public.user_follows;

create policy "users can unfollow"
  on public.user_follows
  for delete
  to authenticated
  using (auth.uid() = follower_id);
