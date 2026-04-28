alter table public.profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.session_reactions enable row level security;
alter table public.announcements enable row level security;
alter table public.user_streaks enable row level security;

drop policy if exists "profiles readable by authenticated users" on public.profiles;
drop policy if exists "sessions readable by authenticated users" on public.learning_sessions;
drop policy if exists "reactions readable by authenticated users" on public.session_reactions;
drop policy if exists "announcements readable by authenticated users" on public.announcements;
drop policy if exists "streaks readable by authenticated users" on public.user_streaks;
drop policy if exists "users can insert own learning sessions" on public.learning_sessions;
drop policy if exists "users can update own learning sessions" on public.learning_sessions;
drop policy if exists "users can delete own learning sessions" on public.learning_sessions;

create policy "profiles readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "sessions readable by authenticated users"
on public.learning_sessions
for select
to authenticated
using (true);

create policy "reactions readable by authenticated users"
on public.session_reactions
for select
to authenticated
using (true);

create policy "announcements readable by authenticated users"
on public.announcements
for select
to authenticated
using (true);

create policy "streaks readable by authenticated users"
on public.user_streaks
for select
to authenticated
using (true);

create policy "users can insert own learning sessions"
on public.learning_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own learning sessions"
on public.learning_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own learning sessions"
on public.learning_sessions
for delete
to authenticated
using (auth.uid() = user_id);
