import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { searchProfiles } from '../lib/api';
import type { Profile } from '../lib/types';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchProfiles(query.trim());
        setResults(data);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <Text className="text-2xl font-semibold text-ink dark:text-white">Search</Text>
      <View className="mt-6">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search by username or name"
        />
      </View>

      {loading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
            className="flex-row items-center gap-3 rounded-2xl border border-ink-300/40 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-surface-darkMuted"
          >
            <Avatar uri={item.avatar_url} name={item.display_name} />
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink dark:text-slate-100">
                {item.display_name}
              </Text>
              <Text className="text-sm text-ink-600 dark:text-slate-400">@{item.username}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        )}
        ListEmptyComponent={
          query ? (
            <View className="items-center py-10">
              <Text className="text-sm text-ink-600 dark:text-slate-400">No users found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
