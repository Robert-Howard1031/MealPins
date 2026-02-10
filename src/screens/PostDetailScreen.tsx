import React, { useRef } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../components/ui/Avatar';
import { IconButton } from '../components/ui/IconButton';
import { formatTimestamp } from '../lib/format';
import { deletePost } from '../lib/api';
import type { Post } from '../lib/types';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';

export default function PostDetailScreen({ navigation, route }: { navigation: any; route: any }) {
  const { user } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';
  const { post } = route.params as { post: Post };
  const isOwner = post.user_id === user?.id;
  const { width } = useWindowDimensions();
  const imageWidth = width - 48;
  const imageHeight = 288;
  const zoomRef = useRef<ScrollView | null>(null);
  const zoomScaleRef = useRef(1);

  const resetZoom = () => {
    if (zoomScaleRef.current <= 1.01) return;
    zoomRef.current?.scrollResponderZoomTo({
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
      animated: true,
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete post?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(post.id, post.image_url);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Delete failed', 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
      >
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </Pressable>

      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.navigate('UserProfile', { userId: post.user_id })}
          className="flex-row items-center gap-3"
        >
          <Avatar uri={post.profile?.avatar_url} name={post.profile?.display_name} size={44} />
          <View>
            <Text className="text-base font-semibold text-ink dark:text-white">
              {post.profile?.display_name || 'User'}
            </Text>
            <Text className="text-sm text-ink-600 dark:text-slate-400">
              @{post.profile?.username || 'username'}
            </Text>
          </View>
        </Pressable>

        {isOwner ? (
          <View className="flex-row gap-2">
            <IconButton onPress={() => navigation.navigate('EditPost', { post })}>
              <Ionicons name="create-outline" size={18} color={iconColor} />
            </IconButton>
            <IconButton onPress={handleDelete} className="bg-red-500/10">
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </IconButton>
          </View>
        ) : null}
      </View>

      <View className="overflow-hidden rounded-3xl">
        <ScrollView
          ref={zoomRef}
          style={{ height: imageHeight }}
          contentContainerStyle={{ width: imageWidth, height: imageHeight }}
          minimumZoomScale={1}
          maximumZoomScale={3}
          pinchGestureEnabled
          bouncesZoom
          onScroll={(event) => {
            const scale = event.nativeEvent.zoomScale ?? 1;
            zoomScaleRef.current = scale;
          }}
          scrollEventThrottle={16}
          onScrollEndDrag={() => setTimeout(resetZoom, 120)}
          onMomentumScrollEnd={() => setTimeout(resetZoom, 120)}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={{ uri: post.image_url }} style={{ width: imageWidth, height: imageHeight }} />
        </ScrollView>
      </View>

      <View className="mt-6 gap-2">
        <Text className="text-sm text-ink-600 dark:text-slate-300">{post.description}</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location" size={14} color="#5E7D63" />
          <Text className="text-sm text-ink-600 dark:text-slate-400">{post.location_name}</Text>
        </View>
        <Text className="text-xs text-ink-500 dark:text-slate-400">
          {formatTimestamp(post.created_at)}
        </Text>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
