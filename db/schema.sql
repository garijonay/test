create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists varieties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null,
  origin text,
  generation text,
  seed_stock integer not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crosses (
  id uuid primary key default gen_random_uuid(),
  mother_variety_id uuid not null references varieties(id),
  father_variety_id uuid not null references varieties(id),
  pollination_date date not null,
  status text not null default 'planned' check (status in ('planned', 'pollinated', 'harvested', 'failed')),
  flowers_pollinated integer not null default 0,
  seed_batch_code text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  plant_code text not null unique,
  variety_id uuid not null references varieties(id),
  cross_id uuid references crosses(id),
  generation text not null,
  germination_date date,
  transplant_date date,
  harvest_date date,
  location text,
  vigor smallint,
  productivity smallint,
  health smallint,
  morphology smallint,
  state text not null default 'active' check (state in ('active', 'selected', 'discarded', 'lost')),
  created_at timestamptz not null default now()
);

create table if not exists phenotype_scores (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  score_date date not null,
  heat_score smallint,
  stability_score smallint,
  productivity_score smallint,
  morphology_score smallint,
  health_score smallint,
  aroma_score smallint,
  notes text
);

create table if not exists shu_samples (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id),
  fruit_code text,
  lab_name text not null,
  method text,
  sampled_at date not null,
  shu_result numeric(12,2) not null,
  document_url text,
  notes text
);

create table if not exists environmental_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  location text,
  irrigation text,
  fertilizer text,
  substrate text,
  ph numeric(4,2),
  ec numeric(6,2),
  temperature_c numeric(5,2),
  humidity_pct numeric(5,2),
  light_notes text,
  stress_notes text
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('variety', 'cross', 'plant', 'shu_sample', 'guinness_candidate')),
  entity_id uuid not null,
  file_url text not null,
  file_type text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  due_date date,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  related_entity_type text,
  related_entity_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists guinness_candidates (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id),
  target_record text not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'ready', 'submitted')),
  evidence_notes text,
  chronology jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
