-- Site-wide settings that administrators change from the admin dashboard. A single row (id = 1).
--
--   data_retention_days            Enquiries older than this many days are deleted automatically by the daily
--                                  clean-up (/api/cron/data-retention). NULL keeps enquiries until deleted by hand.
--   breach_notification_enabled    Reserved for notifying affected people and the Data Protection Board of India
--                                  after a data breach. Shown as "coming soon" in the dashboard; nothing uses it yet.
--
-- Only the server (service role) can read or change it, like the other tables.

create table if not exists public.global_settings (
  id smallint primary key default 1 constraint global_settings_single_row check (id = 1),
  data_retention_days integer
    constraint global_settings_retention_range check (data_retention_days is null or data_retention_days between 1 and 3650),
  breach_notification_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);

insert into public.global_settings (id) values (1) on conflict (id) do nothing;

alter table public.global_settings enable row level security;
revoke all on table public.global_settings from public, anon, authenticated;
grant select, insert, update on table public.global_settings to service_role;

-- The clean-up deletes by submission date
create index if not exists growth_applications_submitted_at_idx on public.growth_applications (submitted_at);
