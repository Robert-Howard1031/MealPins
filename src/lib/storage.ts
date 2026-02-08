import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

import { supabase } from './supabase';

export function getStoragePathFromPublicUrl(url: string) {
  const marker = '/storage/v1/object/public/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length);
  const [bucket, ...rest] = path.split('/');
  if (!bucket || rest.length === 0) return null;
  return { bucket, path: rest.join('/') };
}

export async function uploadImageAsync(
  uri: string,
  bucket: string,
  path: string
): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });
  const contentType = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const arrayBuffer = decode(base64);

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImageByUrl(url: string) {
  const parsed = getStoragePathFromPublicUrl(url);
  if (!parsed) return;
  await supabase.storage.from(parsed.bucket).remove([parsed.path]);
}
