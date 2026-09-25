-- Run this once in the Supabase SQL editor.
-- It creates the riders, their finished runs, and a public leaderboard
-- that returns only name, score, and good-food count.

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  client_run_id uuid not null unique,
  score integer not null check (score between 0 and 2000),
  healthy_collected integer not null default 0 check (healthy_collected between 0 and 200),
  junk_collected integer not null default 0 check (junk_collected between 0 and 200),
  finished_at timestamptz not null default now(),
  status text not null default 'completed' check (status = 'completed'),
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_player_score_idx
  on public.game_sessions (player_id, score desc, healthy_collected desc);

-- One row per name: that rider's best finished run.
-- Same score: the run with more good food stays. Then the earlier finish.
create or replace view public.leaderboard
with (security_invoker = false) as
select
  best.name,
  best.score,
  best.healthy,
  best.junk
from (
  select distinct on (lower(btrim(p.name)))
    btrim(p.name) as name,
    s.score,
    s.healthy_collected as healthy,
    s.junk_collected as junk
  from public.game_sessions s
  join public.players p on p.id = s.player_id
  where s.status = 'completed'
  order by lower(btrim(p.name)), s.score desc, s.healthy_collected desc, s.finished_at asc
) best;

alter table public.players enable row level security;
alter table public.game_sessions enable row level security;

revoke all on table public.players from anon, authenticated;
revoke all on table public.game_sessions from anon, authenticated;
revoke all on table public.leaderboard from anon, authenticated;
grant select on table public.leaderboard to anon, authenticated;

create or replace function public.submit_score(
  player_name text,
  player_score integer,
  player_healthy integer,
  player_junk integer,
  run_id uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_name text := btrim(player_name);
  rider_id uuid;
begin
  if clean_name is null or char_length(clean_name) < 1 or char_length(clean_name) > 24 then
    raise exception 'invalid name';
  end if;
  if player_score is null or player_score < 0 or player_score > 2000 then
    raise exception 'invalid score';
  end if;
  if player_healthy is null or player_healthy < 0 or player_healthy > 200 then
    raise exception 'invalid healthy count';
  end if;
  if player_junk is null or player_junk < 0 or player_junk > 200 then
    raise exception 'invalid junk count';
  end if;
  if run_id is null then
    raise exception 'invalid run';
  end if;
  if player_score > player_healthy * 10 then
    raise exception 'score exceeds collected food';
  end if;

  if exists (select 1 from public.game_sessions where client_run_id = run_id) then
    return;
  end if;

  insert into public.players (name)
  values (clean_name)
  returning id into rider_id;

  insert into public.game_sessions (
    player_id,
    client_run_id,
    score,
    healthy_collected,
    junk_collected,
    status
  )
  values (
    rider_id,
    run_id,
    player_score,
    player_healthy,
    player_junk,
    'completed'
  );
exception
  when unique_violation then
    return;
end;
$$;

revoke all on function public.submit_score(text, integer, integer, integer, uuid) from public;
grant execute on function public.submit_score(text, integer, integer, integer, uuid) to anon, authenticated;
