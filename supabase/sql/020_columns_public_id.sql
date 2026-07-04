-- コラムの公開URL用 short ID（/{user_id}/{public_id}）

create or replace function public.columns_generate_public_id()
returns text
language plpgsql
as $$
declare
  alphabet constant text := '0123456789abcdefghijklmnopqrstuvwxyz';
  reserved constant text[] := array[
    'published', 'drafts', 'feed', 'followers', 'following',
    'edit', 'new', 'columns', 'settings', 'login', 'signup',
    'terms', 'privacy', 'design', 'mypage', 'auth', 'users'
  ];
  candidate text;
  i int;
  j int;
begin
  loop
    candidate := '';
    for i in 1..7 loop
      j := floor(random() * length(alphabet))::int + 1;
      candidate := candidate || substr(alphabet, j, 1);
    end loop;

    if not (candidate = any(reserved))
      and not exists (
        select 1 from public.columns where public_id = candidate
      )
    then
      return candidate;
    end if;
  end loop;
end;
$$;

alter table public.columns
  add column if not exists public_id text;

update public.columns
set public_id = public.columns_generate_public_id()
where public_id is null;

alter table public.columns
  alter column public_id set not null;

create unique index if not exists columns_public_id_key
  on public.columns (public_id);

comment on column public.columns.public_id is '公開URL用の短いID（/{user_id}/{public_id}）';

create or replace function public.columns_set_public_id()
returns trigger
language plpgsql
as $$
begin
  if new.public_id is null or btrim(new.public_id) = '' then
    new.public_id := public.columns_generate_public_id();
  end if;
  return new;
end;
$$;

drop trigger if exists columns_public_id_before_insert on public.columns;

create trigger columns_public_id_before_insert
  before insert on public.columns
  for each row
  execute function public.columns_set_public_id();
