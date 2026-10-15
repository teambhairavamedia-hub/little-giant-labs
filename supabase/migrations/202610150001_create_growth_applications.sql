create table if not exists public.growth_applications (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  industry_vertical text not null check (industry_vertical in (
    'Enterprise Banking & FinTech',
    'Heavy Infrastructure & Real Estate',
    'Premium Consumer Goods (D2C)',
    'Venture-Backed Technology',
    'High-Ticket B2B Services'
  )),
  ttm_revenue text not null check (ttm_revenue in (
    'Under $1 Million', '$1M – $5 Million', '$5M – $20 Million', '$20 Million+'
  )),
  monthly_ad_spend text not null check (monthly_ad_spend in (
    'Under $10,000 / month', '$10,000 – $50,000 / month', '$50,000 – $150,000 / month', '$150,000+ / month'
  )),
  growth_bottleneck text not null check (growth_bottleneck in (
    'Ad platform algorithmic fatigue & dropping ROAS',
    'Inability to produce high-retention visual media at scale',
    'Lack of advanced attribution models and data tracking',
    'Sub-optimal customer lifetime value (LTV) and backend CRM systems'
  )),
  partnership_readiness text not null check (partnership_readiness in (
    'We are looking for a cheap, hands-off execution vendor',
    'We are prepared to invest premium capital for institutional scale and long-term partnership'
  )),
  decision_maker_email text not null,
  decision_maker_linkedin text not null,
  qualification_status text not null default 'qualified' check (qualification_status in ('qualified', 'rejected')),
  rejection_reasons jsonb,
  submitted_at timestamptz not null default now()
);

alter table public.growth_applications enable row level security;

-- Submissions go through the validated Next.js route using the server-only service role.
-- No anon/authenticated policies or grants are created; service_role bypasses RLS by design.
revoke all on table public.growth_applications from public, anon, authenticated;
grant all on table public.growth_applications to service_role;

-- Fail the migration if project automation left public policies or grants behind.
do $$
begin
  if not (
    select relrowsecurity from pg_class
    where oid = 'public.growth_applications'::regclass
  ) then
    raise exception 'RLS must be enabled on public.growth_applications';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'growth_applications'
      and roles && array['public', 'anon', 'authenticated']::name[]
  ) then
    raise exception 'Remove public, anon, and authenticated policies from growth_applications';
  end if;

  if has_table_privilege('anon', 'public.growth_applications', 'SELECT')
     or has_table_privilege('anon', 'public.growth_applications', 'INSERT')
     or has_table_privilege('anon', 'public.growth_applications', 'UPDATE')
     or has_table_privilege('anon', 'public.growth_applications', 'DELETE')
     or has_table_privilege('authenticated', 'public.growth_applications', 'SELECT')
     or has_table_privilege('authenticated', 'public.growth_applications', 'INSERT')
     or has_table_privilege('authenticated', 'public.growth_applications', 'UPDATE')
     or has_table_privilege('authenticated', 'public.growth_applications', 'DELETE') then
    raise exception 'anon and authenticated must not have table access to growth_applications';
  end if;
end
$$;
