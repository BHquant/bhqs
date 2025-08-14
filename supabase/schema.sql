
-- Core schema & RLS
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'trader',
  created_at timestamptz default now()
);

create table if not exists public.signals (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  horizon_days int not null default 7,
  prob_up numeric check (prob_up between 0 and 100),
  prob_flat numeric check (prob_flat between 0 and 100),
  prob_down numeric check (prob_down between 0 and 100),
  price_target_pct numeric,
  model_version text,
  inputs jsonb,
  created_at timestamptz default now()
);

create table if not exists public.trades_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  option_type text,
  strike numeric,
  expiry date,
  scenario text,
  decision text,
  rationale text,
  signal_id bigint references public.signals(id) on delete set null,
  submitted_at timestamptz default now(),
  result_7d jsonb,
  excel_url text
);

alter table public.profiles enable row level security;
alter table public.signals enable row level security;
alter table public.trades_log enable row level security;

create policy "profiles_self" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_upd" on public.profiles for update using (auth.uid() = id);

create policy "rw_own_signals" on public.signals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "rw_own_trades" on public.trades_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, role) values (new.id, new.email, 'trader');
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();
