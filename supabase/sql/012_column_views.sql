-- コラム閲覧数（セッション単位で重複除外）
alter table public.columns
  add column if not exists view_count integer not null default 0;

comment on column public.columns.view_count is '閲覧数（公開コラムのみ、作者本人・同一セッションの再訪は除外）';

alter table public.columns
  drop constraint if exists columns_view_count_non_negative;

alter table public.columns
  add constraint columns_view_count_non_negative check (view_count >= 0);

create table if not exists public.column_view_sessions (
  column_id uuid not null references public.columns (id) on delete cascade,
  viewer_key text not null,
  created_at timestamptz not null default now(),
  constraint column_view_sessions_pkey primary key (column_id, viewer_key),
  constraint column_view_sessions_viewer_key_length check (
    char_length(viewer_key) >= 8
    and char_length(viewer_key) <= 128
  )
);

comment on table public.column_view_sessions is 'コラム閲覧のセッション重複除外';

alter table public.column_view_sessions enable row level security;

create or replace function public.record_column_view(
  p_column_id uuid,
  p_viewer_key text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_author_id uuid;
  v_status text;
  v_count integer;
begin
  if p_viewer_key is null
    or char_length(p_viewer_key) < 8
    or char_length(p_viewer_key) > 128
  then
    raise exception 'invalid viewer_key';
  end if;

  select author_id, status, view_count
  into v_author_id, v_status, v_count
  from public.columns
  where id = p_column_id;

  if not found then
    return 0;
  end if;

  if v_status <> 'published' then
    return coalesce(v_count, 0);
  end if;

  if auth.uid() is not null and auth.uid() = v_author_id then
    return coalesce(v_count, 0);
  end if;

  with inserted as (
    insert into public.column_view_sessions (column_id, viewer_key)
    values (p_column_id, p_viewer_key)
    on conflict (column_id, viewer_key) do nothing
    returning 1
  )
  update public.columns
  set view_count = view_count + 1
  where id = p_column_id
    and exists (select 1 from inserted);

  select view_count into v_count
  from public.columns
  where id = p_column_id;

  return coalesce(v_count, 0);
end;
$$;

comment on function public.record_column_view(uuid, text) is
  '公開コラムの閲覧を記録し、最新の閲覧数を返す（作者本人・同一セッションは加算しない）';

grant execute on function public.record_column_view(uuid, text) to anon, authenticated;
