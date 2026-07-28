-- ISO-Cert Portal database schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- One row per authenticated user; tracks role and which company they belong to.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  company_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  legal_name text,
  license_no text,
  address text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_company_id_fkey;
alter table public.profiles
  add constraint profiles_company_id_fkey foreign key (company_id) references public.companies(id) on delete set null;

create table if not exists public.iso_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null check (type in ('single', 'multi')),
  accreditation_body text not null,
  status text not null default 'Draft',
  amount numeric not null default 0,
  standards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payment fields: a request only exists once Stripe confirms payment (see
-- the Stripe webhook, which is the only thing that inserts rows here now).
alter table public.iso_requests add column if not exists currency text not null default 'usd' check (currency in ('usd', 'aed'));
alter table public.iso_requests add column if not exists payment_status text not null default 'paid' check (payment_status in ('paid', 'refunded'));
alter table public.iso_requests add column if not exists stripe_session_id text;

create table if not exists public.request_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.iso_requests(id) on delete cascade,
  name text not null,
  type text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message text,
  updated_at timestamptz not null default now()
);

-- Helper used by RLS policies below. security definer + table owner lets it
-- read profiles without recursing back through the profiles RLS policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.iso_requests enable row level security;
alter table public.request_documents enable row level security;
alter table public.tickets enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "companies_select_own_or_admin" on public.companies;
create policy "companies_select_own_or_admin" on public.companies for select
  using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "companies_insert_own" on public.companies;
create policy "companies_insert_own" on public.companies for insert
  with check (owner_id = auth.uid());

drop policy if exists "companies_update_own_or_admin" on public.companies;
create policy "companies_update_own_or_admin" on public.companies for update
  using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "requests_select_own_or_admin" on public.iso_requests;
create policy "requests_select_own_or_admin" on public.iso_requests for select
  using (
    company_id in (select id from public.companies where owner_id = auth.uid())
    or public.is_admin()
  );

-- No client-facing insert policy on purpose: requests are only ever created
-- by the Stripe webhook (via the service_role key, which bypasses RLS), so
-- a client can never insert an unpaid request directly.
drop policy if exists "requests_insert_own" on public.iso_requests;

drop policy if exists "requests_update_own_or_admin" on public.iso_requests;
create policy "requests_update_own_or_admin" on public.iso_requests for update
  using (
    company_id in (select id from public.companies where owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "documents_select_own_or_admin" on public.request_documents;
create policy "documents_select_own_or_admin" on public.request_documents for select
  using (
    request_id in (
      select id from public.iso_requests
      where company_id in (select id from public.companies where owner_id = auth.uid())
    )
    or public.is_admin()
  );

drop policy if exists "documents_insert_own" on public.request_documents;
create policy "documents_insert_own" on public.request_documents for insert
  with check (
    request_id in (
      select id from public.iso_requests
      where company_id in (select id from public.companies where owner_id = auth.uid())
    )
  );

drop policy if exists "documents_update_own_or_admin" on public.request_documents;
create policy "documents_update_own_or_admin" on public.request_documents for update
  using (
    request_id in (
      select id from public.iso_requests
      where company_id in (select id from public.companies where owner_id = auth.uid())
    )
    or public.is_admin()
  );

drop policy if exists "tickets_select_own_or_admin" on public.tickets;
create policy "tickets_select_own_or_admin" on public.tickets for select
  using (
    company_id in (select id from public.companies where owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "tickets_insert_own" on public.tickets;
create policy "tickets_insert_own" on public.tickets for insert
  with check (
    company_id in (select id from public.companies where owner_id = auth.uid())
  );

drop policy if exists "tickets_update_own_or_admin" on public.tickets;
create policy "tickets_update_own_or_admin" on public.tickets for update
  using (
    company_id in (select id from public.companies where owner_id = auth.uid())
    or public.is_admin()
  );

-- On signup, auto-create a company (named from signup metadata) and a
-- matching client profile, so the app has somewhere to attach requests to.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
begin
  insert into public.companies (owner_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'company_name', 'My Company'))
  returning id into new_company_id;

  insert into public.profiles (id, full_name, role, company_id)
  values (new.id, new.raw_user_meta_data->>'full_name', 'client', new_company_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To make an account an admin (unlocks seeing every company's requests in
-- the Admin Panel), run once you have a user:
--   update public.profiles set role = 'admin' where id = '<user-uuid-here>';
