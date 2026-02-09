import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="items-center justify-center gap-3 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-brand/10">
        <Ionicons name="sparkles" size={22} color="#5E7D63" />
      </View>
      <Text className="text-base font-semibold text-ink dark:text-slate-100">{title}</Text>
      <Text className="text-center text-sm text-ink-600 dark:text-slate-400">{subtitle}</Text>
    </View>
  );
}
