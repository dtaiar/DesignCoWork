-- Design Companion — Supabase setup
-- Run this in: Supabase Dashboard → SQL Editor → New query

-- ─── captures table ──────────────────────────────────────────────────────────

create table if not exists captures (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  status       text        not null    default 'done',   -- 'pending' | 'enriching' | 'done'
  type         text        not null    default 'Article',
  type_color   text,
  title        text        not null,
  source       text,
  points       jsonb       not null    default '[]',     -- string[]
  relevance    text,
  chip         jsonb,                                    -- { label, cls }
  chip2        jsonb,                                    -- { label, cls }
  preview_text text                    default ''
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- The app has no auth yet, so anon users can read + write all rows.
-- Tighten this once user accounts are added.

alter table captures enable row level security;

create policy "anon_read"   on captures for select to anon using (true);
create policy "anon_insert" on captures for insert to anon with check (true);
create policy "anon_update" on captures for update to anon using (true);
create policy "anon_delete" on captures for delete to anon using (true);

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Enables the subscription in useCaptures.js (new captures appear without refresh)

alter publication supabase_realtime add table captures;
