-- Wedly demo seed data
-- IMPORTANT:
-- 1) Replace the email below with your chosen owner workspace email.
-- 2) Run this after schema.sql.

do $$
declare
  demo_owner_email text := 'demo@wedly.test';
  demo_event_id uuid;
begin
  insert into public.events (owner_email, slug, couple_names, wedding_date, venue, message)
  values (
    lower(trim(demo_owner_email)),
    'nadia-aiman',
    'Nadia & Aiman',
    '2026-12-20',
    'The Glasshouse, Kuala Lumpur',
    'Join us as we celebrate our special day with the people we love most.'
  )
  on conflict (slug) do update
    set owner_email = excluded.owner_email,
        couple_names = excluded.couple_names,
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
