-- =====================================================================
-- Infusions Tech portal - database setup
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again (it uses "if not exists" / "or replace").
-- =====================================================================

-- ---------- 1. Tables ------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null default '',
  last_name   text not null default '',
  email       text,
  phone       text unique,
  company     text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  service      text,
  status       text not null default 'planning'
               check (status in ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  progress     int  not null default 0 check (progress between 0 and 100),
  start_date   date,
  due_date     date,
  created_at   timestamptz not null default now()
);

create table if not exists public.project_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  message     text not null,
  progress    int,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  service      text not null,
  title        text not null,
  details      text,
  budget       text,
  deadline     date,
  status       text not null default 'new'
               check (status in ('new', 'reviewing', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  author_name  text not null default '',
  company      text,
  kind         text not null default 'review' check (kind in ('review', 'feedback')),
  rating       int  not null check (rating between 1 and 5),
  service      text,
  comment      text not null,
  approved     boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  sender       text not null check (sender in ('customer', 'admin')),
  body         text not null,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.portfolio (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text,
  description  text,
  image_url    text,
  link_url     text,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists projects_customer_idx on public.projects(customer_id);
create index if not exists updates_project_idx   on public.project_updates(project_id, created_at desc);
create index if not exists orders_customer_idx   on public.orders(customer_id, created_at desc);
create index if not exists messages_thread_idx   on public.messages(customer_id, created_at);
create index if not exists reviews_public_idx    on public.reviews(approved, kind, created_at desc);

-- ---------- 2. Helper: is the current user an admin? ------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- 3. Create a profile automatically for every new user ------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  full_name text := coalesce(meta->>'full_name', meta->>'name', '');
  first_part text := split_part(full_name, ' ', 1);
  fn text;
  ln text;
begin
  fn := coalesce(nullif(meta->>'first_name', ''), nullif(meta->>'given_name', ''), first_part, '');
  ln := coalesce(
          nullif(meta->>'last_name', ''),
          nullif(meta->>'family_name', ''),
          nullif(trim(substr(full_name, length(first_part) + 1)), ''),
          ''
        );

  insert into public.profiles (id, first_name, last_name, email, phone, company)
  values (new.id, fn, ln, new.email, nullif(meta->>'phone', ''), nullif(meta->>'company', ''))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Customers can never promote themselves: only an admin (or the SQL editor) can change a role.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only an admin can change a role';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role on public.profiles;
create trigger protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ---------- 4. Row Level Security (who can see / change what) ---------

alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.project_updates enable row level security;
alter table public.orders          enable row level security;
alter table public.reviews         enable row level security;
alter table public.messages        enable row level security;
alter table public.portfolio       enable row level security;

-- profiles
drop policy if exists "profiles read"   on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "profiles update" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Column-level limits: customers may only edit their own name/phone/company
-- (never role or email) and may only flip the "read" flag on messages.
revoke update on public.profiles from authenticated;
grant  update (first_name, last_name, phone, company) on public.profiles to authenticated;
revoke update on public.messages from authenticated;
grant  update (is_read) on public.messages to authenticated;

-- projects: customers see their own, admins see and manage everything
drop policy if exists "projects read"  on public.projects;
drop policy if exists "projects admin" on public.projects;
create policy "projects read" on public.projects for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());
create policy "projects admin" on public.projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- project updates
drop policy if exists "updates read"  on public.project_updates;
drop policy if exists "updates admin" on public.project_updates;
create policy "updates read" on public.project_updates for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.projects p where p.id = project_id and p.customer_id = auth.uid())
  );
create policy "updates admin" on public.project_updates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- orders: a customer creates their own (always as 'new') and may cancel a 'new' one
drop policy if exists "orders read"   on public.orders;
drop policy if exists "orders insert" on public.orders;
drop policy if exists "orders cancel" on public.orders;
drop policy if exists "orders admin"  on public.orders;
create policy "orders read" on public.orders for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());
create policy "orders insert" on public.orders for insert to authenticated
  with check (customer_id = auth.uid() and status = 'new');
create policy "orders cancel" on public.orders for update to authenticated
  using (customer_id = auth.uid() and status = 'new')
  with check (customer_id = auth.uid() and status = 'cancelled');
create policy "orders admin" on public.orders for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- reviews: public can read approved reviews (never private feedback)
drop policy if exists "reviews public read" on public.reviews;
drop policy if exists "reviews own read"    on public.reviews;
drop policy if exists "reviews insert"      on public.reviews;
drop policy if exists "reviews delete own"  on public.reviews;
drop policy if exists "reviews admin"       on public.reviews;
create policy "reviews public read" on public.reviews for select to anon, authenticated
  using (approved = true and kind = 'review');
create policy "reviews own read" on public.reviews for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());
create policy "reviews insert" on public.reviews for insert to authenticated
  with check (customer_id = auth.uid() and approved = false);
create policy "reviews delete own" on public.reviews for delete to authenticated
  using (customer_id = auth.uid());
create policy "reviews admin" on public.reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- messages: one thread per customer
drop policy if exists "messages read"    on public.messages;
drop policy if exists "messages send"    on public.messages;
drop policy if exists "messages mark"    on public.messages;
drop policy if exists "messages admin"   on public.messages;
create policy "messages read" on public.messages for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());
create policy "messages send" on public.messages for insert to authenticated
  with check (customer_id = auth.uid() and sender = 'customer');
create policy "messages mark" on public.messages for update to authenticated
  using (customer_id = auth.uid() and sender = 'admin')
  with check (customer_id = auth.uid() and sender = 'admin');
create policy "messages admin" on public.messages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- portfolio ("latest projects" shown on the public website)
drop policy if exists "portfolio read"  on public.portfolio;
drop policy if exists "portfolio admin" on public.portfolio;
create policy "portfolio read" on public.portfolio for select to anon, authenticated
  using (published = true or public.is_admin());
create policy "portfolio admin" on public.portfolio for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 5. Image storage for the portfolio ------------------------

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio images read"   on storage.objects;
drop policy if exists "portfolio images write"  on storage.objects;
drop policy if exists "portfolio images delete" on storage.objects;
create policy "portfolio images read" on storage.objects for select
  using (bucket_id = 'portfolio');
create policy "portfolio images write" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio images delete" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

-- =====================================================================
-- AFTER you register your own account on the website, make it an admin
-- by running this ONE line (put your own email inside the quotes):
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- =====================================================================
