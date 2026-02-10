import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';
import { isUsernameAvailable, updateProfile } from '../lib/api';
import { uploadImageAsync } from '../lib/storage';

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const { user, profile, refreshProfile } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const iconColor = resolvedScheme === 'dark' ? '#F8FAFC' : '#0F172A';

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setUsername(profile?.username || '');
    setBio(profile?.bio || '');
    setAvatarUri(profile?.avatar_url || null);
    setAvatarChanged(false);
  }, [profile?.id, profile?.display_name, profile?.username, profile?.bio]);

  const pickAvatar = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsEditing: true,
          aspect: [1, 1],
        });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
      setAvatarChanged(true);
    }
  };

  const showAvatarOptions = () => {
    Alert.alert('Update profile photo', 'Choose a source', [
      { text: 'Choose Photo', onPress: () => pickAvatar(false) },
      { text: 'Take Photo', onPress: () => pickAvatar(true) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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
    if (!/^[a-zA-Z0-9._]+$/.test(nextUsername)) {
      Alert.alert(
        'Invalid username',
        'Usernames can only contain letters, numbers, "." and "_".'
      );
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

      let avatarUrl = profile?.avatar_url || null;
      if (avatarChanged && avatarUri) {
        const path = `${user.id}/${Date.now()}.jpg`;
        avatarUrl = await uploadImageAsync(avatarUri, 'avatars', path);
      }

      await updateProfile(user.id, {
        display_name: nextDisplay,
        username: nextUsername,
        bio: bio.trim(),
        avatar_url: avatarUrl,
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

      <View className="mt-6 flex-row items-center gap-4">
        <Pressable onPress={showAvatarOptions}>
          <Avatar uri={avatarUri} name={displayName} size={96} />
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-surface-darkMuted">
            <Ionicons name="camera" size={16} color={iconColor} />
          </View>
        </Pressable>
        <View className="flex-1">
          <Button label="Change Photo" variant="secondary" onPress={showAvatarOptions} />
        </View>
      </View>

      <View className="mt-6 gap-4">
        <Input label="Display name" value={displayName} onChangeText={setDisplayName} />
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          className="h-24 py-3"
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
