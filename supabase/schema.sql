create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) >= 2),
  email text not null unique,
  photo_url text default '',
  weekly_goal numeric(5,1) not null default 20 check (weekly_goal >= 1),
  notifications_enabled boolean not null default false,
  reminder_time time not null default '19:00',
  telegram_handle text default '',
  onboarding_completed_at timestamptz,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  learned text not null check (char_length(trim(learned)) > 0),
  hours numeric(4,1) not null check (hours >= 0.5 and hours <= 24),
  challenges text not null default '',
  logged_at timestamptz not null default now(),
  session_day date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_reactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.learning_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('🔥', '👏', '💡')),
  created_at timestamptz not null default now(),
  unique (session_id, user_id, emoji)
);

create table if not exists public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active date,
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(trim(body)) >= 4),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_admin on public.profiles (is_admin);
create index if not exists idx_sessions_user_day on public.learning_sessions (user_id, session_day desc);
create index if not exists idx_sessions_logged_at on public.learning_sessions (logged_at desc);
create index if not exists idx_reactions_session on public.session_reactions (session_id);
create index if not exists idx_announcements_created_at on public.announcements (created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    photo_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  insert into public.user_streaks (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

create or replace function public.enforce_session_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*)
  into recent_count
  from public.learning_sessions
  where user_id = new.user_id
    and created_at >= now() - interval '10 minutes';

  if recent_count >= 10 then
    raise exception 'Rate limit exceeded. Please wait a few minutes before logging again.';
  end if;

  return new;
end;
$$;

create or replace function public.refresh_user_streaks(p_user_id uuid)
returns void
language plpgsql
as $$
declare
  v_current integer := 0;
  v_longest integer := 0;
  v_last_active date := null;
begin
  with qualifying_days as (
    select session_day
    from public.learning_sessions
    where user_id = p_user_id
    group by session_day
    having sum(hours) >= 0.5
  ),
  grouped as (
    select
      session_day,
      session_day - (row_number() over (order by session_day))::int as grp
    from qualifying_days
  ),
  streaks as (
    select
      min(session_day) as streak_start,
      max(session_day) as streak_end,
      count(*)::int as streak_length
    from grouped
    group by grp
  )
  select
    coalesce(max(streak_length), 0),
    coalesce(
      (
        select streak_length
        from streaks
        where streak_end in (current_date, current_date - 1)
        order by streak_end desc
        limit 1
      ),
      0
    ),
    (select max(session_day) from qualifying_days)
  into v_longest, v_current, v_last_active;

  insert into public.user_streaks (user_id, current_streak, longest_streak, last_active, updated_at)
  values (p_user_id, v_current, v_longest, v_last_active, now())
  on conflict (user_id) do update
    set current_streak = excluded.current_streak,
        longest_streak = excluded.longest_streak,
        last_active = excluded.last_active,
        updated_at = now();
end;
$$;

create or replace function public.handle_session_streak_refresh()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_user_streaks(old.user_id);
    return old;
  end if;

  perform public.refresh_user_streaks(new.user_id);

  if tg_op = 'UPDATE' and old.user_id is distinct from new.user_id then
    perform public.refresh_user_streaks(old.user_id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_sessions_updated_at on public.learning_sessions;
create trigger trg_sessions_updated_at
before update on public.learning_sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_sessions_rate_limit on public.learning_sessions;
create trigger trg_sessions_rate_limit
before insert on public.learning_sessions
for each row execute procedure public.enforce_session_rate_limit();

drop trigger if exists trg_sessions_refresh_streaks on public.learning_sessions;
create trigger trg_sessions_refresh_streaks
after insert or update or delete on public.learning_sessions
for each row execute procedure public.handle_session_streak_refresh();

alter table public.profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.session_reactions enable row level security;
alter table public.user_streaks enable row level security;
alter table public.announcements enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
on public.profiles
for select
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
on public.profiles
for delete
using (public.is_admin());

drop policy if exists "Sessions are publicly readable" on public.learning_sessions;
create policy "Sessions are publicly readable"
on public.learning_sessions
for select
using (true);

drop policy if exists "Users can insert their own sessions" on public.learning_sessions;
create policy "Users can insert their own sessions"
on public.learning_sessions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own sessions" on public.learning_sessions;
create policy "Users can update their own sessions"
on public.learning_sessions
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can delete their own sessions" on public.learning_sessions;
create policy "Users can delete their own sessions"
on public.learning_sessions
for delete
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Reactions are publicly readable" on public.session_reactions;
create policy "Reactions are publicly readable"
on public.session_reactions
for select
using (true);

drop policy if exists "Users can manage their own reactions" on public.session_reactions;
create policy "Users can manage their own reactions"
on public.session_reactions
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Streaks are publicly readable" on public.user_streaks;
create policy "Streaks are publicly readable"
on public.user_streaks
for select
using (true);

drop policy if exists "Announcements are publicly readable" on public.announcements;
create policy "Announcements are publicly readable"
on public.announcements
for select
using (true);

drop policy if exists "Admins can manage announcements" on public.announcements;
create policy "Admins can manage announcements"
on public.announcements
for all
using (public.is_admin())
with check (public.is_admin());
