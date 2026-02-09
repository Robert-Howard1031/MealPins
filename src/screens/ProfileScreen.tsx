import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../components/ui/Avatar';
import { PostGrid } from '../components/PostGrid';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { fetchFollowCounts, fetchPostsByUser } from '../lib/api';
import type { Post } from '../lib/types';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';
import { formatCount } from '../lib/format';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, profile } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [postData, counts] = await Promise.all([
        fetchPostsByUser(user.id),
        fetchFollowCounts(user.id),
      ]);
      setPosts(postData);
      setStats(counts);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [navigation, loadProfile]);


  return (
    <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-4">
          <Avatar uri={profile?.avatar_url} name={profile?.display_name} size={64} />
          <View>
            <Text className="text-xl font-semibold text-ink dark:text-white">
              {profile?.display_name || 'Your name'}
            </Text>
            <Text className="text-sm text-ink-600 dark:text-slate-400">
              @{profile?.username || 'username'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
        >
          <Ionicons name="settings-outline" size={20} color={iconColor} />
        </Pressable>
      </View>

      <View className="mt-8 flex-row justify-around rounded-2xl bg-white/90 py-4 shadow-sm dark:bg-surface-darkMuted">
        <View className="items-center">
          <Text className="text-lg font-semibold text-ink dark:text-white">
            {formatCount(stats.posts)}
          </Text>
          <Text className="text-xs text-ink-600 dark:text-slate-400">Posts</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-ink dark:text-white">
            {formatCount(stats.followers)}
          </Text>
          <Text className="text-xs text-ink-600 dark:text-slate-400">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-ink dark:text-white">
            {formatCount(stats.following)}
          </Text>
          <Text className="text-xs text-ink-600 dark:text-slate-400">Following</Text>
        </View>
      </View>

      {profile?.bio ? (
        <Text className="mt-4 text-sm text-ink-600 dark:text-slate-400">
          {profile.bio}
        </Text>
      ) : null}

      <View className="mt-6">
        <Button
          label="Edit Profile"
          variant="secondary"
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>

      <View className="mt-8">
        {loading ? (
          <ActivityIndicator size="large" color="#5E7D63" />
        ) : posts.length === 0 ? (
          <EmptyState title="No posts yet" subtitle="Share your first meal to fill this grid." />
        ) : (
          <PostGrid
            posts={posts}
            onPress={(post) => navigation.navigate('PostDetail', { post })}
            scrollEnabled={false}
          />
        )}
      </View>
      <View className="h-24" />
    </ScrollView>
  );
}
