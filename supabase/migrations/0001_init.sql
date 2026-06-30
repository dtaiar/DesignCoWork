-- DesignCoWork core schema: multi-tenant design assistant
-- orgs -> topics -> captures / figma_refs / decisions / audits

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table org_members (
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  status text not null default 'open' check (status in ('open', 'exploring', 'resolved')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table captures (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  created_by uuid references auth.users(id),
  type text not null default 'text' check (type in ('text', 'figma_link', 'voice')),
  content text not null,
  enriched boolean not null default false,
  enrichment text,
  created_at timestamptz not null default now()
);

create table figma_refs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  figma_url text not null,
  file_key text,
  frame_id text,
  snapshot_image_url text,
  fetched_metadata jsonb,
  created_at timestamptz not null default now()
);

create table decisions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  title text not null,
  body text,
  pinned boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audits (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  kind text not null,
  findings jsonb not null default '[]',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index on org_members (user_id);
create index on topics (org_id);
create index on captures (org_id, topic_id);
create index on figma_refs (org_id, topic_id);
create index on decisions (org_id, topic_id);
create index on audits (org_id, topic_id);

alter table organizations enable row level security;
alter table org_members enable row level security;
alter table topics enable row level security;
alter table captures enable row level security;
alter table figma_refs enable row level security;
alter table decisions enable row level security;
alter table audits enable row level security;

create function is_org_member(check_org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from org_members
    where org_id = check_org_id and user_id = auth.uid()
  );
$$;

create policy "members can view their org" on organizations
  for select using (is_org_member(id));

create policy "members can view org membership" on org_members
  for select using (is_org_member(org_id));

create policy "members can manage topics" on topics
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy "members can manage captures" on captures
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy "members can manage figma_refs" on figma_refs
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy "members can manage decisions" on decisions
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy "members can manage audits" on audits
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));
