-- 文字数制限を140文字固定に変更
alter table public.columns
  drop constraint if exists columns_char_limit_allowed;

alter table public.columns
  drop constraint if exists columns_char_limit_fixed;

update public.columns
set char_limit = 140
where char_limit <> 140;

alter table public.columns
  add constraint columns_char_limit_fixed check (char_limit = 140);

comment on column public.columns.char_limit is '文字数上限（140文字）';
