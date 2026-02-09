import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { IconButton } from './ui/IconButton';
import { formatTimestamp } from '../lib/format';
import type { Post } from '../lib/types';
import { useThemePreference } from '../providers/ThemeProvider';

const DESCRIPTION_LIMIT = 120;

export function PostPreviewCard({
  post,
  isOwner,
  onPressPost,
  onPressUser,
  onEdit,
  onDelete,
}: {
  post: Post;
  isOwner: boolean;
  onPressPost: () => void;
  onPressUser: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';
  const description =
    post.description.length > DESCRIPTION_LIMIT
      ? `${post.description.slice(0, DESCRIPTION_LIMIT)}...`
      : post.description;

  return (
    <Card className="gap-4">
      <Pressable onPress={onPressPost} className="overflow-hidden rounded-2xl">
        <Image
          source={{ uri: post.image_url }}
          className="h-52 w-full"
          resizeMode="cover"
        />
      </Pressable>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-ink dark:text-slate-100" numberOfLines={1}>
          {post.title}
        </Text>
        <Text className="text-sm text-ink-600 dark:text-slate-300" numberOfLines={3}>
          {description}
        </Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location" size={14} color="#5E7D63" />
          <Text className="text-xs text-ink-500 dark:text-slate-400" numberOfLines={1}>
            {post.location_name}
          </Text>
        </View>
        <Text className="text-xs text-ink-500 dark:text-slate-400">
          {formatTimestamp(post.created_at)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Pressable onPress={onPressUser} className="flex-row items-center gap-2">
          <Avatar uri={post.profile?.avatar_url} name={post.profile?.display_name} size={28} />
          <Text className="text-sm font-semibold text-ink dark:text-slate-100">
            @{post.profile?.username || 'user'}
          </Text>
        </Pressable>

        {isOwner ? (
          <View className="flex-row gap-2">
            <IconButton onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={iconColor} />
            </IconButton>
            <IconButton onPress={onDelete} className="bg-red-500/10">
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </IconButton>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
