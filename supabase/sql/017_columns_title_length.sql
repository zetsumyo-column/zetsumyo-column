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

comment on column public.columns.title is 'コラムタイトル（10〜30文字、空白・改行を除く）';

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
