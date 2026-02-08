import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/EmptyState';
import { PostGrid } from '../components/PostGrid';
import {
  fetchFollowCounts,
  fetchPostsByUser,
  fetchProfile,
  followUser,
  isFollowing as checkFollowing,
  unfollowUser,
} from '../lib/api';
import type { Post, Profile } from '../lib/types';
import { formatCount } from '../lib/format';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';

export default function UserProfileScreen({ navigation, route }: { navigation: any; route: any }) {
  const { user } = useAuth();
  const { userId } = route.params as { userId: string };
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const isSelf = user?.id === userId;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, postData, counts] = await Promise.all([
        fetchProfile(userId),
        fetchPostsByUser(userId),
        fetchFollowCounts(userId),
      ]);
      setProfile(profileData);
      setPosts(postData);
      setStats(counts);
      if (user?.id) {
        const status = await checkFollowing(user.id, userId);
        setFollowing(status);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userId]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const toggleFollow = async () => {
    if (!user?.id) return;
    try {
      if (following) {
        await unfollowUser(user.id, userId);
        setFollowing(false);
      } else {
        await followUser(user.id, userId);
        setFollowing(true);
      }
      const counts = await fetchFollowCounts(userId);
      setStats(counts);
    } catch (error) {
      console.warn(error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-6 pt-16 dark:bg-surface-dark">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
      >
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </Pressable>

      {profile ? (
        <View>
          <View className="flex-row items-center gap-4">
            <Avatar uri={profile.avatar_url} name={profile.display_name} size={64} />
            <View className="flex-1">
              <Text className="text-xl font-semibold text-ink dark:text-white">
                {profile.display_name}
              </Text>
              <Text className="text-sm text-ink-600 dark:text-slate-400">@{profile.username}</Text>
              {profile.bio ? (
                <Text className="mt-2 text-sm text-ink-600 dark:text-slate-400">{profile.bio}</Text>
              ) : null}
            </View>
          </View>

          {!isSelf ? (
            <View className="mt-6">
              <Button
                label={following ? 'Following' : 'Follow'}
                variant={following ? 'secondary' : 'primary'}
                onPress={toggleFollow}
              />
            </View>
          ) : null}

          <View className="mt-6 flex-row justify-around rounded-2xl bg-white/90 py-4 shadow-sm dark:bg-surface-darkMuted">
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

          <View className="mt-8">
            {posts.length === 0 ? (
              <EmptyState title="No posts yet" subtitle="This user hasn't shared any meals." />
            ) : (
              <PostGrid
                posts={posts}
                onPress={(post) => navigation.navigate('PostDetail', { post })}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      ) : (
        <EmptyState title="User not found" subtitle="Try another profile." />
      )}

      <View className="h-24" />
    </ScrollView>
  );
}
