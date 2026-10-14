-- Run in Supabase SQL Editor. Review with your security/compliance owner before production.
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  province text,
  postal_code text not null,
  shipping_method text not null check (shipping_method in ('regular','express')),
  payment_method text not null check (payment_method in ('qris','bank_transfer')),
  subtotal bigint not null check (subtotal >= 0),
  shipping_fee bigint not null check (shipping_fee >= 0),
  discount bigint not null default 0 check (discount >= 0),
  total bigint not null check (total >= 0),
  items jsonb not null,
  status text not null default 'pending_payment',
  payment_status text not null default 'pending',
  payment_reference text,
  payment_url text,
  midtrans_transaction_id text,
  midtrans_transaction_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_phone_idx on public.orders(phone);
create index if not exists orders_payment_status_idx on public.orders(payment_status);

-- Browser clients must not be able to read/write orders directly.
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
-- Server routes in this starter use the caller's Supabase session client.
-- For production, use a server-only service-role client in API routes, never expose its key,
-- and add rate limiting, order ownership checks, retention policies, and audit logging.
