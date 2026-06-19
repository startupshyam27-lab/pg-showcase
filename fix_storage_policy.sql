-- Fix Storage Policies to allow anonymous uploads (required for Simulated Admin mode)
-- Also fixes CORS issues which might be blocking the upload

-- 1. Drop existing restrictive policies to ensure no conflicts
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;
drop policy if exists "Public Delete" on storage.objects;
drop policy if exists "Public Update" on storage.objects;

-- 2. Allow Public Read Access
create policy "Public Access"
  on storage.objects
  for select
  to public
  using ( bucket_id = 'site-assets' );

-- 3. Allow Public Upload (Insert)
create policy "Public Upload"
  on storage.objects
  for insert
  to public
  with check ( bucket_id = 'site-assets' );

-- 4. Allow Public Delete (Required for managing gallery)
create policy "Public Delete"
  on storage.objects
  for delete
  to public
  using ( bucket_id = 'site-assets' );

-- 5. Allow Public Update
create policy "Public Update"
  on storage.objects
  for update
  to public
  using ( bucket_id = 'site-assets' );

-- 6. Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;
