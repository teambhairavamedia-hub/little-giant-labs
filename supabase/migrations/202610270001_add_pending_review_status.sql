alter table public.growth_applications
  alter column qualification_status set default 'pending_review';

alter table public.growth_applications
  drop constraint if exists growth_applications_qualification_status_check;

alter table public.growth_applications
  add constraint growth_applications_qualification_status_check
  check (qualification_status in ('qualified', 'rejected', 'pending_review'));
