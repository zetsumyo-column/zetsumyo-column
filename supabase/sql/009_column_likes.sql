-- コラムへのいいね
create table if not exists public.column_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  column_id uuid not null references public.columns (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint column_likes_user_column_unique unique (user_id, column_id)
);

comment on table public.column_likes is 'コラムへのいいね';

create index if not exists column_likes_column_id_idx
  on public.column_likes (column_id);

alter table public.column_likes enable row level security;

drop policy if exists "likes on published columns are viewable by everyone" on public.column_likes;

create policy "likes on published columns are viewable by everyone"
  on public.column_likes
  for select
  using (
    exists (
      select 1
      from public.columns
      where columns.id = column_likes.column_id
        and columns.status = 'published'
    )
  );

drop policy if exists "authenticated users can like published columns" on public.column_likes;

create policy "authenticated users can like published columns"
  on public.column_likes
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.columns
      where columns.id = column_id
        and columns.status = 'published'
    )
  );

drop policy if exists "users can remove own likes" on public.column_likes;

create policy "users can remove own likes"
  on public.column_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);
