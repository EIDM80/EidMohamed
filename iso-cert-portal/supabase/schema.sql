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

-- Referral program: anyone (partner or existing client) can be given a
-- referral code + shareable link. When an order paid through that link
-- completes, the code is stamped onto the resulting iso_requests row so an
-- admin can total up how much commission (AED 500/order, fixed elsewhere)
-- is owed per referrer.
create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  referrer_name text not null,
  referrer_contact text,
  created_at timestamptz not null default now()
);

alter table public.iso_requests add column if not exists referral_code text;
create index if not exists idx_iso_requests_referral_code on public.iso_requests (referral_code);

-- Certificates are sold as a subscription (auto-renews every 1 or 3 years
-- via Stripe), not a one-time purchase. subscription_status tracks Stripe's
-- billing state independently from `status` (the certification workflow
-- state) — a certificate can be RequestStatus.CERTIFIED while its
-- subscription is 'past_due' if a renewal charge failed.
alter table public.iso_requests add column if not exists renewal_term text not null default '1y' check (renewal_term in ('1y', '3y'));
alter table public.iso_requests add column if not exists stripe_customer_id text;
alter table public.iso_requests add column if not exists stripe_subscription_id text;
alter table public.iso_requests add column if not exists subscription_status text not null default 'active' check (subscription_status in ('active', 'past_due', 'canceled', 'unpaid'));
alter table public.iso_requests add column if not exists next_renewal_at timestamptz;

create index if not exists idx_iso_requests_stripe_subscription_id on public.iso_requests (stripe_subscription_id);

create table if not exists public.request_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.iso_requests(id) on delete cascade,
  name text not null,
  type text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  storage_path text,
  created_at timestamptz not null default now()
);

-- Singleton table (always exactly one row) for site-wide marketing/analytics
-- tracking codes and other global config. These must be visible to every
-- visitor's browser (not just the admin's), unlike landingConfig which is
-- stored in the admin's own localStorage — so this lives in the database.
create table if not exists public.site_settings (
  id boolean primary key default true,
  meta_pixel_id text,
  ga_measurement_id text,
  gtm_container_id text,
  google_site_verification text,
  custom_head_code text,
  custom_body_code text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- Singleton table holding the public landing page's editable content (hero
-- text, contact info, partner logos, etc.) as a JSON blob, so an admin's
-- edit in the panel is visible to every visitor — not just their own
-- browser, which is all localStorage ever did.
create table if not exists public.landing_config (
  id boolean primary key default true,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint landing_config_singleton check (id)
);

insert into public.landing_config (id, config) values (true, '{}'::jsonb) on conflict (id) do nothing;

-- Leads from the public "Lead Auditor Training" section. Anyone can submit
-- one (no auth required — it's a marketing form), but only staff can read
-- them. The submit-training-inquiry endpoint also emails these to
-- iso@gloria-c.com; this table is the fallback so a lead is never lost even
-- if the email fails to send.
create table if not exists public.training_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  company text,
  standard_code text,
  message text,
  email_sent boolean not null default false,
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
alter table public.site_settings enable row level security;
alter table public.training_leads enable row level security;
alter table public.landing_config enable row level security;
alter table public.referral_codes enable row level security;

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

-- Admin-only: nothing in the client UI has a legitimate reason for a
-- company to edit its own request row (status transitions, payment/
-- subscription fields, amounts) — those all go through the admin panel or
-- the Stripe webhook (which uses the service_role key and bypasses RLS).
drop policy if exists "requests_update_own_or_admin" on public.iso_requests;
create policy "requests_update_own_or_admin" on public.iso_requests for update
  using (public.is_admin());

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

-- Tracking codes are injected into every visitor's page, so everyone must be
-- able to read them; only an admin can change them.
drop policy if exists "site_settings_select_all" on public.site_settings;
create policy "site_settings_select_all" on public.site_settings for select
  using (true);

drop policy if exists "site_settings_update_admin" on public.site_settings;
create policy "site_settings_update_admin" on public.site_settings for update
  using (public.is_admin());

-- Every visitor needs to read the landing page's live content; only an
-- admin can change it.
drop policy if exists "landing_config_select_all" on public.landing_config;
create policy "landing_config_select_all" on public.landing_config for select
  using (true);

drop policy if exists "landing_config_update_admin" on public.landing_config;
create policy "landing_config_update_admin" on public.landing_config for update
  using (public.is_admin());

-- Admin-only: referral codes are created and reported on entirely from the
-- Admin Panel. The checkout-session endpoint that stamps a code onto a paid
-- order uses the service_role key (bypasses RLS), so no public policy here.
drop policy if exists "referral_codes_select_admin" on public.referral_codes;
create policy "referral_codes_select_admin" on public.referral_codes for select
  using (public.is_admin());

drop policy if exists "referral_codes_insert_admin" on public.referral_codes;
create policy "referral_codes_insert_admin" on public.referral_codes for insert
  with check (public.is_admin());

-- No public insert policy: the submit-training-inquiry endpoint uses the
-- service_role key (bypasses RLS) so it can insert *and* send the email in
-- one request, the same pattern as the Stripe webhook.
drop policy if exists "training_leads_select_admin" on public.training_leads;
create policy "training_leads_select_admin" on public.training_leads for select
  using (public.is_admin());

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
