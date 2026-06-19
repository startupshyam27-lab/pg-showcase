-- Create site_content table
create table public.site_content (
  key text primary key,
  value text,
  type text check (type in ('text', 'image', 'rich_text', 'link')),
  "group" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_content enable row level security;

-- Create policies
create policy "Allow public read access"
  on public.site_content
  for select
  to public
  using (true);

create policy "Allow authenticated insert"
  on public.site_content
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update"
  on public.site_content
  for update
  to authenticated
  using (true);

-- Create storage bucket for site-assets if it doesn't exist
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects
  for select
  to public
  using ( bucket_id = 'site-assets' );

create policy "Authenticated Upload"
  on storage.objects
  for insert
  to authenticated
  with check ( bucket_id = 'site-assets' );
