-- GHY Pro database. Paste this whole file into Supabase → SQL Editor → Run.
-- It creates the orders table and locks it down so only you (admins) can read orders.

create table if not exists public.orders (
  id              text primary key,                 -- e.g. GHY-261111-AB12
  created_at      timestamptz not null default now(),
  status          text not null default 'new'
                  check (status in ('new', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method  text not null check (payment_method in ('cod', 'upi')),
  payment_status  text not null default 'pending'
                  check (payment_status in ('pending', 'reported', 'paid')),
  upi_ref         text,                             -- 12-digit UPI reference the customer reports
  customer_name   text not null,
  phone           text not null,
  area            text not null,
  address         text not null,
  landmark        text,
  notes           text,
  slot            text not null,
  items           jsonb not null,                   -- [{id, name, weight, qty, total}]
  subtotal        numeric not null,
  delivery_fee    numeric not null,
  total           numeric not null
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- People allowed into /admin. Add your login email here (see the README).
create table if not exists public.admins (
  email text primary key
);

alter table public.orders enable row level security;
alter table public.admins enable row level security;

-- Orders are written only by the site's server function (service role key),
-- so the public cannot insert, read or change them directly.
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'))
  with check (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves" on public.admins
  for select to authenticated
  using (email = auth.jwt() ->> 'email');

-- Then run this once with your own email:
-- insert into public.admins (email) values ('you@example.com');
