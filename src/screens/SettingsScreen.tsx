import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';
import { font } from '../lib/typography';

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const { signOut } = useAuth();
  const { theme, setTheme, resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';

  const handleLogout = async () => {
    Alert.alert('Log out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
      >
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </Pressable>

      <Text className="text-2xl font-semibold text-ink dark:text-white" style={font.semibold}>
        Settings
      </Text>

      <View className="mt-8 gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-surface-darkMuted">
        <Text className="text-sm font-semibold text-ink dark:text-slate-200" style={font.semibold}>
          Theme
        </Text>
        {['system', 'light', 'dark'].map((mode) => (
          <Pressable
            key={mode}
            onPress={() => setTheme(mode as any)}
            className="flex-row items-center justify-between rounded-xl px-3 py-2"
          >
            <Text className="text-base text-ink dark:text-slate-100" style={font.regular}>
              {mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
            </Text>
            {theme === mode ? <Ionicons name="checkmark" size={18} color="#5E7D63" /> : null}
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleLogout}
        className="mt-10 flex-row items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-3"
      >
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text className="text-base font-semibold text-red-500" style={font.semibold}>
          Log out
        </Text>
      </Pressable>
    </View>
  );
}
