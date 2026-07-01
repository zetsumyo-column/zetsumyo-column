-- コラムに下書き/公開ステータスを追加
alter table public.columns
  add column if not exists status text not null default 'published';

update public.columns
set status = 'published'
where status is null;

alter table public.columns
  drop constraint if exists columns_status_allowed;

alter table public.columns
  add constraint columns_status_allowed check (status in ('draft', 'published'));

-- 下書きは空タイトル・空本文を許可
alter table public.columns
  drop constraint if exists columns_title_not_empty;

alter table public.columns
  drop constraint if exists columns_title_not_empty_when_published;

alter table public.columns
  add constraint columns_title_not_empty_when_published
  check (status = 'draft' or char_length(trim(title)) >= 1);

alter table public.columns
  drop constraint if exists columns_content_not_empty;

alter table public.columns
  drop constraint if exists columns_content_not_empty_when_published;

alter table public.columns
  add constraint columns_content_not_empty_when_published
  check (status = 'draft' or char_length(trim(content)) >= 1);

comment on column public.columns.status is 'draft=下書き, published=公開';

-- RLS: 公開コラムは全員閲覧可、下書きは本人のみ
drop policy if exists "columns are viewable by everyone" on public.columns;

create policy "published columns are viewable by everyone"
  on public.columns
  for select
  using (status = 'published');

create policy "authors can view own drafts"
  on public.columns
  for select
  to authenticated
  using (status = 'draft' and auth.uid() = author_id);

create index if not exists columns_status_created_at_idx
  on public.columns (status, created_at desc);
