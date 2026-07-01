-- TipTap（HTML）保存に対応するため、HTML文字数制限のDB制約を削除
-- 文字数制限はアプリ側でプレーンテキスト長により検証する
alter table public.columns
  drop constraint if exists columns_content_within_limit;

comment on column public.columns.content is 'コラム本文（TipTap HTML）';
