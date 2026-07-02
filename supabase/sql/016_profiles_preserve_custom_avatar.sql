-- 再ログイン時に Google アバターでカスタム画像を上書きしない
-- （001 の handle_user_updated を修正。001 は再実行しないこと）

create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_avatar_url text;
begin
  latest_avatar_url := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );

  update public.profiles
  set
    avatar_url = coalesce(latest_avatar_url, avatar_url),
    updated_at = now()
  where id = new.id
    and (
      avatar_url is null
      or avatar_url !~ '/storage/v1/object/public/avatars/'
    );

  return new;
end;
$$;
