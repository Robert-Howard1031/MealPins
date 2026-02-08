import React from 'react';
import { FlatList, Image, Pressable, useWindowDimensions, View } from 'react-native';

import type { Post } from '../lib/types';

export function PostGrid({
  posts,
  onPress,
  scrollEnabled = true,
  horizontalPadding = 24,
}: {
  posts: Post[];
  onPress: (post: Post) => void;
  scrollEnabled?: boolean;
  horizontalPadding?: number;
}) {
  const { width } = useWindowDimensions();
  const columns = 3;
  const gap = 8;
  const itemSize = Math.floor((width - horizontalPadding * 2 - gap * (columns - 1)) / columns);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      scrollEnabled={scrollEnabled}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={{ gap, paddingBottom: 32 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPress(item)}
          style={{ width: itemSize, height: itemSize }}
        >
          <View className="h-full w-full overflow-hidden rounded-2xl border border-ink-300/30 dark:border-slate-700">
            <Image source={{ uri: item.image_url }} className="h-full w-full" />
          </View>
        </Pressable>
      )}
    />
  );
}
