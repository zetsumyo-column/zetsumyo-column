-- 文字数カウントから空白・改行を除外（文字のみ数える）
create or replace function public.columns_compute_plain_text_length(p_content text)
returns integer
language sql
immutable
as $$
  select char_length(
    regexp_replace(
      regexp_replace(
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
        ),
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

comment on column public.columns.plain_text_length is '本文の文字数（HTML・空白・改行を除く）';

-- 既存行を再計算
update public.columns
set content = content;
