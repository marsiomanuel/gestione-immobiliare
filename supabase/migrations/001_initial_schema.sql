-- Gestione Immobiliare: tabelle flessibili, separate e protette per utente.
create extension if not exists pgcrypto;

do $migration$
declare
  table_name text;
begin
  foreach table_name in array array[
    'properties', 'owners', 'contracts', 'expenses',
    'rent_payments', 'reminders', 'evaluations'
  ]
  loop
    execute format(
      'create table if not exists public.%I (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id) on delete cascade,
        data jsonb not null default ''{}''::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )', table_name
    );
    execute format('create index if not exists %I on public.%I(user_id)', table_name || '_user_id_idx', table_name);
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    execute format('drop policy if exists "Users manage own rows" on public.%I', table_name);
    execute format(
      'create policy "Users manage own rows" on public.%I
       for all to authenticated
       using ((select auth.uid()) = user_id)
       with check ((select auth.uid()) = user_id)', table_name
    );
  end loop;
end
$migration$;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "Users upload own documents" on storage.objects;
create policy "Users upload own documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users read own documents" on storage.objects;
create policy "Users read own documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users delete own documents" on storage.objects;
create policy "Users delete own documents"
on storage.objects for delete to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $function$
begin
  delete from auth.users where id = auth.uid();
end;
$function$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
