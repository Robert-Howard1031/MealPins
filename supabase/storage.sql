-- Storage buckets and policies

-- Create buckets in Supabase dashboard: post-images, avatars

-- Example policies for public read + owner write

create policy "Public read for post images"
  on storage.objects for select
  to public
  using (bucket_id = 'post-images');

create policy "Users can upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "Users can delete their post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');

create policy "Public read for avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "Users can update avatars"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');
