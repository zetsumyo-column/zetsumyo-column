-- 公開済みコラムの改ざん・削除を RLS で防止（下書きのみ UPDATE / DELETE 可）
drop policy if exists "users can update own columns" on public.columns;
drop policy if exists "authors can update own drafts" on public.columns;

create policy "authors can update own drafts"
  on public.columns
  for update
  to authenticated
  using (auth.uid() = author_id and status = 'draft')
  with check (
    auth.uid() = author_id
    and status in ('draft', 'published')
  );

drop policy if exists "users can delete own columns" on public.columns;
drop policy if exists "authors can delete own drafts" on public.columns;

create policy "authors can delete own drafts"
  on public.columns
  for delete
  to authenticated
  using (auth.uid() = author_id and status = 'draft');
