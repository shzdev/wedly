create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_slug_idx on public.events(slug);
create index if not exists rsvps_event_id_idx on public.rsvps(event_id);
create unique index if not exists events_user_one_event_idx on public.events(user_id);

alter table public.events enable row level security;
alter table public.rsvps enable row level security;

drop policy if exists "events owner select" on public.events;
create policy "events owner select"
on public.events
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "events owner insert" on public.events;
create policy "events owner insert"
on public.events
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "events owner update" on public.events;
create policy "events owner update"
on public.events
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "events owner delete" on public.events;
create policy "events owner delete"
on public.events
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "events public read" on public.events;
create policy "events public read"
on public.events
for select
to anon
using (true);

drop policy if exists "events authenticated public read" on public.events;
create policy "events authenticated public read"
on public.events
for select
to authenticated
using (true);

drop policy if exists "rsvps public read" on public.rsvps;
create policy "rsvps public read"
on public.rsvps
for select
to anon
using (true);

drop policy if exists "rsvps authenticated public read" on public.rsvps;
create policy "rsvps authenticated public read"
on public.rsvps
for select
to authenticated
using (true);

drop policy if exists "rsvps public insert" on public.rsvps;
create policy "rsvps public insert"
on public.rsvps
for insert
to anon
with check (true);

drop policy if exists "rsvps authenticated public insert" on public.rsvps;
create policy "rsvps authenticated public insert"
on public.rsvps
for insert
to authenticated
with check (true);

drop policy if exists "rsvps owner update" on public.rsvps;
create policy "rsvps owner update"
on public.rsvps
for update
to authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and e.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and e.user_id = auth.uid()
  )
);

drop policy if exists "rsvps owner delete" on public.rsvps;
create policy "rsvps owner delete"
on public.rsvps
for delete
to authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and e.user_id = auth.uid()
  )
);
