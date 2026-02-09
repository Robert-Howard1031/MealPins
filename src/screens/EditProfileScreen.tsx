import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';
import { isUsernameAvailable, updateProfile } from '../lib/api';

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const { user, profile, refreshProfile } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setUsername(profile?.username || '');
  }, [profile?.id, profile?.display_name, profile?.username]);

  const handleSave = async () => {
    if (!user?.id) return;
    const nextDisplay = displayName.trim();
    const nextUsername = username.trim();

    if (!nextDisplay) {
      Alert.alert('Display name required', 'Please enter a display name.');
      return;
    }
    if (!nextUsername) {
      Alert.alert('Username required', 'Please enter a username.');
      return;
    }
    if (/\s/.test(nextUsername)) {
      Alert.alert('Invalid username', 'Usernames cannot contain spaces.');
      return;
    }

    try {
      setSaving(true);
      if (nextUsername !== profile?.username) {
        const available = await isUsernameAvailable(nextUsername, user.id);
        if (!available) {
          Alert.alert('Username taken', 'That username is already in use.');
          setSaving(false);
          return;
        }
      }

      await updateProfile(user.id, {
        display_name: nextDisplay,
        username: nextUsername,
      });
      await refreshProfile();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted"
      >
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </Pressable>

      <Text className="text-2xl font-semibold text-ink dark:text-white">Edit Profile</Text>

      <View className="mt-6 gap-4">
        <Input label="Display name" value={displayName} onChangeText={setDisplayName} />
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="mt-8 gap-3">
        <Button label="Save Changes" onPress={handleSave} loading={saving} />
        <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
