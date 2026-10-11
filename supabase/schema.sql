-- =====================================================================
-- VANTA STUDIO — Supabase schema (optional)
-- Run in the Supabase SQL editor after enabling Auth.
-- RLS is enabled on every table. Admin writes require an authenticated
-- user whose JWT `app_role` claim is 'admin'.
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists collections (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  tagline     text not null default '',
  description text not null default '',
  image       text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id               text primary key,
  slug             text unique not null,
  name             text not null,
  description      text not null,
  details          text[] not null default '{}',
  price            numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  category         text not null check (category in
                    ('outerwear','knitwear','shirts','trousers','accessories')),
  collection_ids   text[] not null default '{}',
  sizes            text[] not null default '{}',
  images           text[] not null default '{}',
  stock            integer not null default 0 check (stock >= 0),
  featured         boolean not null default false,
  created_at       timestamptz not null default now()
);

create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  number          text unique not null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  shipping        jsonb not null,
  items           jsonb not null,
  subtotal        numeric(10,2) not null,
  shipping_cost   numeric(10,2) not null,
  total           numeric(10,2) not null,
  payment_method  text not null check (payment_method in ('pix','card','boleto')),
  status          text not null default 'pending'
                    check (status in ('pending','paid','shipped','delivered','cancelled')),
  demo            boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Role helper: reads `app_role` from the JWT claims.
create or replace function is_admin() returns boolean as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$ language sql stable;

alter table collections enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;

-- Read policies: catalog is public
create policy collections_read on collections for select using (true);
create policy products_read    on products    for select using (true);

-- Write policies: admins only
create policy collections_write on collections for all
  using (is_admin()) with check (is_admin());

create policy products_write on products for all
  using (is_admin()) with check (is_admin());

-- Orders: insert by anyone (checkout is public demo),
-- but only admins can read/update.
create policy orders_insert on orders for insert with check (true);
create policy orders_admin_read on orders for select using (is_admin());
create policy orders_admin_update on orders for update using (is_admin());

-- Optional: mark a user as admin (run once, replace email):
-- update auth.users
-- set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role','admin')
-- where email = 'admin@example.com';
