import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
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
import { font } from '../lib/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, profile } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [headerHeight, setHeaderHeight] = useState(0);
  const [avatarOpen, setAvatarOpen] = useState(false);

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
    <View className="flex-1">
      <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                if (profile?.avatar_url) setAvatarOpen(true);
              }}
            >
              <Avatar uri={profile?.avatar_url} name={profile?.display_name} size={96} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-ink dark:text-white" style={font.semibold}>
                {profile?.display_name || 'Your name'}
              </Text>
              <Text className="text-sm text-ink-600 dark:text-slate-400" style={font.regular}>
                @{profile?.username || 'username'}
              </Text>
              <View className="mt-3 flex-row gap-6">
                <View className="items-center">
                  <Text className="text-lg font-semibold text-ink dark:text-white" style={font.semibold}>
                    {formatCount(stats.posts)}
                  </Text>
                  <Text className="text-sm text-ink-600 dark:text-slate-400" style={font.regular}>
                    Posts
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-semibold text-ink dark:text-white" style={font.semibold}>
                    {formatCount(stats.followers)}
                  </Text>
                  <Text className="text-sm text-ink-600 dark:text-slate-400" style={font.regular}>
                    Followers
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-semibold text-ink dark:text-white" style={font.semibold}>
                    {formatCount(stats.following)}
                  </Text>
                  <Text className="text-sm text-ink-600 dark:text-slate-400" style={font.regular}>
                    Following
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
          >
            <Ionicons name="settings-outline" size={20} color={iconColor} />
          </Pressable>
        </View>

        {profile?.bio ? (
          <Text className="mt-4 text-sm text-ink-600 dark:text-slate-400" style={font.regular}>
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

        <View className="mt-6 h-px bg-ink-300/80 dark:bg-slate-600/70" />
      </View>

      {loading ? (
        <View
          style={{
            height: Math.max(220, windowHeight - headerHeight - insets.bottom - 120),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#5E7D63" />
        </View>
      ) : posts.length === 0 ? (
        <View className="mt-8">
          <EmptyState title="No posts yet" subtitle="Share your first meal to fill this grid." />
        </View>
      ) : (
        <View className="mt-8">
          <PostGrid
            posts={posts}
            onPress={(post) => navigation.navigate('PostDetail', { post })}
            scrollEnabled={false}
          />
        </View>
      )}
        <View className="h-24" />
      </ScrollView>
      <Modal visible={avatarOpen} transparent animationType="fade" onRequestClose={() => setAvatarOpen(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/80 px-6" onPress={() => setAvatarOpen(false)}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={{ width: 260, height: 260, borderRadius: 130 }}
              resizeMode="cover"
            />
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}
