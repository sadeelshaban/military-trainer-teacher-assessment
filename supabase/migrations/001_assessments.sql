-- Military trainer/teacher self-assessment records
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  role_id text not null check (role_id in ('trainer', 'teacher')),
  scores jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assessments_created_at_idx
  on public.assessments (created_at desc);

alter table public.assessments enable row level security;

create policy "Anyone can submit assessments"
  on public.assessments
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read assessments"
  on public.assessments
  for select
  to anon, authenticated
  using (true);
