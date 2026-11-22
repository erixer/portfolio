-- ==============================================================================
-- Supabase PostgreSQL Schema for Portfolio CMS
-- Jalankan skrip ini di SQL Editor Supabase Project Anda (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Buat tabel portfolio_content jika belum ada
create table if not exists public.portfolio_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.portfolio_content enable row level security;

-- 3. Kebijakan Baca Publik (Pengunjung portfolio & Chatbot AI dapat membaca data)
drop policy if exists "Allow public read access" on public.portfolio_content;
create policy "Allow public read access"
on public.portfolio_content
for select
to anon, authenticated
using (true);

-- 4. Kebijakan Tulis Publik (Dashboard Admin dapat menyimpan perubahan)
drop policy if exists "Allow public insert access" on public.portfolio_content;
create policy "Allow public insert access"
on public.portfolio_content
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow public update access" on public.portfolio_content;
create policy "Allow public update access"
on public.portfolio_content
for update
to anon, authenticated
using (true)
with check (true);

-- ==============================================================================
-- Selesai! Tabel siap digunakan secara otomatis oleh Web Portofolio & Chatbot AI.
-- ==============================================================================
