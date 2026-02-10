import { supabase } from './supabase';
import { getLast24HoursRange } from './date';
import { deleteImageByUrl, uploadImageAsync } from './storage';
import type { Post, Profile } from './types';

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function isUsernameAvailable(username: string, currentUserId?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  if (!data) return true;
  if (currentUserId && data.id === currentUserId) return true;
  return false;
}

export async function updateProfile(
  userId: string,
  updates: { display_name?: string; username?: string; bio?: string | null; avatar_url?: string | null }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function searchProfiles(query: string) {
  if (!query) return [] as Profile[];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(30);

  if (error) throw error;
  return data as Profile[];
}

export async function fetchTodayPostsExplore() {
  const { start, end } = getLast24HoursRange();
  const { data, error } = await supabase
    .from('posts')
    .select('*, profile:profiles(*)')
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function fetchTodayPostsFollowing(userId: string) {
  const { data: follows, error: followError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (followError) throw followError;
  const ids = new Set<string>([userId]);
  follows?.forEach((row) => ids.add(row.following_id));

  const { start, end } = getLast24HoursRange();
  const { data, error } = await supabase
    .from('posts')
    .select('*, profile:profiles(*)')
    .in('user_id', Array.from(ids))
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function fetchPostsByUser(userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profile:profiles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function createPost(params: {
  userId: string;
  imageUri: string;
  title?: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
}) {
  const path = `${params.userId}/${Date.now()}.jpg`;
  const imageUrl = await uploadImageAsync(params.imageUri, 'post-images', path);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: params.userId,
      image_url: imageUrl,
      title: params.title ?? '',
      description: params.description,
      location_name: params.locationName,
      latitude: params.latitude,
      longitude: params.longitude,
    })
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;
  return data as Post;
}

export async function updatePost(postId: string, payload: Partial<Post>) {
  const updates: Partial<Post> = {};
  if (payload.title !== undefined) updates.title = payload.title;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.location_name !== undefined) updates.location_name = payload.location_name;
  if (payload.latitude !== undefined) updates.latitude = payload.latitude;
  if (payload.longitude !== undefined) updates.longitude = payload.longitude;

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(postId: string, imageUrl: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
  await deleteImageByUrl(imageUrl);
}

export async function isFollowing(currentUserId: string, profileId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', currentUserId)
    .eq('following_id', profileId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function followUser(currentUserId: string, profileId: string) {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: currentUserId, following_id: profileId });
  if (error) throw error;
}

export async function unfollowUser(currentUserId: string, profileId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('following_id', profileId);
  if (error) throw error;
}

export async function fetchFollowCounts(profileId: string) {
  const { count: followersCount, error: followersError } = await supabase
    .from('follows')
    .select('follower_id', { count: 'exact', head: true })
    .eq('following_id', profileId);

  if (followersError) throw followersError;

  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('following_id', { count: 'exact', head: true })
    .eq('follower_id', profileId);

  if (followingError) throw followingError;

  const { count: postsCount, error: postsError } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', profileId);

  if (postsError) throw postsError;

  return {
    followers: followersCount || 0,
    following: followingCount || 0,
    posts: postsCount || 0,
  };
}
