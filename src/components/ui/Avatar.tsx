import React from 'react';
import { Image, Text, View } from 'react-native';

import { cn } from '../../lib/cn';

type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
};

export function Avatar({ uri, name, size = 40, className }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={cn(
        'items-center justify-center overflow-hidden border border-ink-300/40 bg-surface-muted dark:border-slate-700 dark:bg-slate-800',
        className
      )}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text className="text-sm font-semibold text-ink dark:text-slate-200">{initials || '?'}</Text>
      )}
    </View>
  );
}
