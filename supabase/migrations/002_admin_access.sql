-- Ruoli applicativi: gli utenti vedono solo i propri dati; gli amministratori vedono tutti gli account.
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;
grant select on public.user_roles to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $function$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$function$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role"
on public.user_roles for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());

do $migration$
declare
  table_name text;
begin
  foreach table_name in array array[
    'properties', 'owners', 'contracts', 'expenses',
    'rent_payments', 'reminders', 'evaluations'
  ]
  loop
    execute format('drop policy if exists "Users manage own rows" on public.%I', table_name);
    execute format('drop policy if exists "Users and admins manage rows" on public.%I', table_name);
    execute format(
      'create policy "Users and admins manage rows" on public.%I
       for all to authenticated
       using ((select auth.uid()) = user_id or public.is_admin())
       with check ((select auth.uid()) = user_id or public.is_admin())', table_name
    );
  end loop;
end
$migration$;

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $function$
  select u.id, u.email::text, coalesce(r.role, 'user'), u.created_at, u.last_sign_in_at
  from auth.users u
  left join public.user_roles r on r.user_id = u.id
  where public.is_admin()
  order by u.created_at desc;
$function$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

-- Assegna il ruolo amministratore dal SQL Editor con un comando separato:
-- insert into public.user_roles (user_id, role)
-- select id, 'admin' from auth.users where email = 'LA_TUA_EMAIL'
-- on conflict (user_id) do update set role = excluded.role;
