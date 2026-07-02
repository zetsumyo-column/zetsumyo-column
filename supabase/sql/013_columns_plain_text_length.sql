-- 一覧表示用のプレーンテキスト文字数（HTML 全文を毎回取得しない）
alter table public.columns
  add column if not exists plain_text_length integer not null default 0;

comment on column public.columns.plain_text_length is '本文の文字数（HTML・空白・改行を除く）';

alter table public.columns
  drop constraint if exists columns_plain_text_length_non_negative;

alter table public.columns
  add constraint columns_plain_text_length_non_negative check (plain_text_length >= 0);

create or replace function public.columns_compute_plain_text_length(p_content text)
returns integer
language sql
immutable
as $$
  select char_length(
    trim(
      regexp_replace(
        regexp_replace(
          regexp_replace(coalesce(p_content, ''), '<br\s*/?>', E'\n', 'gi'),
          '</p>',
          E'\n',
          'gi'
        ),
        '<[^>]*>',
        '',
        'g'
      )
    )
  );
$$;

create or replace function public.columns_set_plain_text_length()
returns trigger
language plpgsql
as $$
begin
  new.plain_text_length := public.columns_compute_plain_text_length(new.content);
  return new;
end;
$$;

drop trigger if exists columns_plain_text_length_before_insert_update on public.columns;

create trigger columns_plain_text_length_before_insert_update
  before insert or update of content
  on public.columns
  for each row
  execute function public.columns_set_plain_text_length();

-- 既存行を再計算
update public.columns
set content = content;
