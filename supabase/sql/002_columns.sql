-- =============================================================================
-- 絶妙コラム: columns テーブル
-- Supabase Dashboard → SQL Editor で実行してください
--
-- ※ 既に columns テーブルがある場合は実行しないでください。
--    未適用の変更は 003〜007 のマイグレーションファイルを使ってください。
-- =============================================================================

create table public.columns (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  char_limit integer not null default 1400,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint columns_title_not_empty_when_published check (status = 'draft' or char_length(trim(title)) >= 1),
  constraint columns_title_max_length check (char_length(title) <= 80),
  constraint columns_content_not_empty check (char_length(trim(content)) >= 1),
  constraint columns_char_limit_fixed check (char_limit = 1400)
);

comment on table public.columns is '文字数制限付きコラム投稿';
comment on column public.columns.title is 'コラムタイトル（80文字以内）';
comment on column public.columns.content is 'コラム本文';
comment on column public.columns.char_limit is '文字数上限（1400文字）';
comment on column public.columns.status is 'draft=下書き, published=公開';

create index columns_created_at_idx on public.columns (created_at desc);
create index columns_author_id_idx on public.columns (author_id);
create index columns_status_created_at_idx on public.columns (status, created_at desc);

create trigger columns_set_updated_at
  before update on public.columns
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.columns enable row level security;

create policy "columns are viewable by everyone"
  on public.columns
  for select
  using (status = 'published');

create policy "authors can view own drafts"
  on public.columns
  for select
  to authenticated
  using (status = 'draft' and auth.uid() = author_id);

create policy "authenticated users can insert own columns"
  on public.columns
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "users can update own columns"
  on public.columns
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "users can delete own columns"
  on public.columns
  for delete
  to authenticated
  using (auth.uid() = author_id);
