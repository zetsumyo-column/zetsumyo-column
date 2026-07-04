-- 作者が自分の公開済みコラムも削除できるようにする

drop policy if exists "users can delete own columns" on public.columns;
drop policy if exists "authors can delete own drafts" on public.columns;
drop policy if exists "authors can delete own columns" on public.columns;

create policy "authors can delete own columns"
  on public.columns
  for delete
  to authenticated
  using (auth.uid() = author_id);
