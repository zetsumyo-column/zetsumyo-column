-- タイトルを10〜30文字に制限（空白・改行は数えない）

create or replace function public.columns_count_title_characters(p_title text)
returns integer
language sql
immutable
as $$
  select char_length(
    regexp_replace(
      regexp_replace(
        trim(coalesce(p_title, '')),
        '[[:space:]]',
        '',
        'g'
      ),
      '　',
      '',
      'g'
    )
  );
$$;

-- 空白・改行を除いた文字数で切り詰める
create or replace function public.columns_truncate_title(p_title text, p_max integer)
returns text
language plpgsql
immutable
as $$
declare
  v_trimmed text := trim(coalesce(p_title, ''));
  v_result text := '';
  v_non_ws_count integer := 0;
  v_char text;
  i integer;
begin
  for i in 1..char_length(v_trimmed) loop
    v_char := substr(v_trimmed, i, 1);

    if v_char !~ '[[:space:]]' and v_char != '　' then
      if v_non_ws_count >= p_max then
        exit;
      end if;
      v_non_ws_count := v_non_ws_count + 1;
    end if;

    v_result := v_result || v_char;
  end loop;

  return v_result;
end;
$$;

comment on column public.columns.title is 'コラムタイトル（10〜30文字、空白・改行を除く）';

-- 既存データを新制約に合わせる（制約追加前に実行）
update public.columns
set title = public.columns_truncate_title(title, 30)
where public.columns_count_title_characters(title) > 30;

update public.columns
set status = 'draft'
where status = 'published'
  and public.columns_count_title_characters(title) < 10;

alter table public.columns
  drop constraint if exists columns_title_max_length;

alter table public.columns
  drop constraint if exists columns_title_not_empty;

alter table public.columns
  drop constraint if exists columns_title_not_empty_when_published;

alter table public.columns
  drop constraint if exists columns_title_max_characters;

alter table public.columns
  drop constraint if exists columns_title_published_length;

alter table public.columns
  add constraint columns_title_max_characters
  check (public.columns_count_title_characters(title) <= 30);

alter table public.columns
  add constraint columns_title_published_length
  check (
    status = 'draft'
    or (
      public.columns_count_title_characters(title) >= 10
      and public.columns_count_title_characters(title) <= 30
    )
  );
