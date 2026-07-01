-- コラムにタイトル列を追加
alter table public.columns
  add column if not exists title text;

-- 既存行があれば仮タイトルを入れてから NOT NULL にする
update public.columns
set title = '無題'
where title is null;

alter table public.columns
  alter column title set not null;

alter table public.columns
  drop constraint if exists columns_title_not_empty;

alter table public.columns
  add constraint columns_title_not_empty check (char_length(trim(title)) >= 1);

alter table public.columns
  drop constraint if exists columns_title_max_length;

alter table public.columns
  add constraint columns_title_max_length check (char_length(title) <= 80);

comment on column public.columns.title is 'コラムタイトル（80文字以内）';
