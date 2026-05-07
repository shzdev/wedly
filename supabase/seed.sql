-- Wedly demo seed data
-- IMPORTANT:
-- 1) Replace the UUID below with a real auth.users id from your Supabase project.
-- 2) Run this after schema.sql.

-- Example lookup:
-- select id, email from auth.users order by created_at desc;

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000000';
  demo_event_id uuid;
begin
  if demo_user_id = '00000000-0000-0000-0000-000000000000' then
    raise exception 'Please replace demo_user_id in supabase/seed.sql with a real auth.users id';
  end if;

  insert into public.events (user_id, slug, couple_names, wedding_date, venue, message)
  values (
    demo_user_id,
    'nadia-aiman',
    'Nadia & Aiman',
    '2026-12-20',
    'The Glasshouse, Kuala Lumpur',
    'Join us as we celebrate our special day with the people we love most.'
  )
  on conflict (slug) do update
    set couple_names = excluded.couple_names,
        wedding_date = excluded.wedding_date,
        venue = excluded.venue,
        message = excluded.message
  returning id into demo_event_id;

  delete from public.rsvps where event_id = demo_event_id;

  insert into public.rsvps (event_id, guest_name, attendance, pax_count, wish_message) values
    (demo_event_id, 'Sofia Rahman', 'attending', 2, 'So happy for both of you. Cannot wait to celebrate together.'),
    (demo_event_id, 'Hakim Zulkifli', 'attending', 1, 'Wishing you both a lifetime of love and laughter.'),
    (demo_event_id, 'Liyana Omar', 'maybe', 2, 'I am trying to adjust my travel plans. Hoping I can make it.'),
    (demo_event_id, 'Irfan & Family', 'attending', 4, 'Tahniah Nadia and Aiman. May your day be full of barakah.'),
    (demo_event_id, 'Nora Aziz', 'not_attending', 0, 'I am away on that weekend, but sending love and prayers.');
end $$;
