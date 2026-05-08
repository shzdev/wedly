create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  slug text not null unique,
  couple_names text not null,
  wedding_date date not null,
  venue text not null,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_name text not null,
  attendance text not null check (attendance in ('attending', 'not_attending', 'maybe')),
  pax_count int not null default 1 check (pax_count >= 0 and pax_count <= 10),
  wish_message text,
  created_at timestamptz not null default now()
);

create unique index if not exists events_owner_email_one_event_idx
  on public.events (lower(trim(owner_email)));
create index if not exists events_owner_email_idx on public.events (lower(trim(owner_email)));
create index if not exists events_slug_idx on public.events(slug);
create index if not exists rsvps_event_id_idx on public.rsvps(event_id);
create index if not exists rsvps_event_guest_name_ci_idx
  on public.rsvps (event_id, lower(trim(guest_name)));

alter table public.events enable row level security;
alter table public.rsvps enable row level security;

drop policy if exists "events public read" on public.events;
create policy "events public read"
on public.events
for select
to anon, authenticated
using (true);

drop policy if exists "events mvp insert" on public.events;
create policy "events mvp insert"
on public.events
for insert
to anon, authenticated
with check (true);

drop policy if exists "events mvp update" on public.events;
create policy "events mvp update"
on public.events
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "events mvp delete" on public.events;
create policy "events mvp delete"
on public.events
for delete
to anon, authenticated
using (true);

drop policy if exists "rsvps public read" on public.rsvps;
create policy "rsvps public read"
on public.rsvps
for select
to anon, authenticated
using (true);

drop policy if exists "rsvps public insert" on public.rsvps;
create policy "rsvps public insert"
on public.rsvps
for insert
to anon, authenticated
with check (true);

drop policy if exists "rsvps mvp update" on public.rsvps;
create policy "rsvps mvp update"
on public.rsvps
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "rsvps mvp delete" on public.rsvps;
create policy "rsvps mvp delete"
on public.rsvps
for delete
to anon, authenticated
using (true);
