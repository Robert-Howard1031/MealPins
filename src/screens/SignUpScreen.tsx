import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../providers/AuthProvider';
import { isUsernameAvailable } from '../lib/api';

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      const nextUsername = username.trim();
      if (!nextUsername) {
        Alert.alert('Missing fields', 'Please enter a username.');
        return;
      }
      if (!/^[a-zA-Z0-9._]+$/.test(nextUsername)) {
        Alert.alert(
          'Invalid username',
          'Usernames can only contain letters, numbers, "." and "_".'
        );
        return;
      }
      setLoading(true);
      const available = await isUsernameAvailable(nextUsername);
      if (!available) {
        Alert.alert('Username taken', 'That username is already in use.');
        setLoading(false);
        return;
      }
      await signUp({
        email: email.trim(),
        password,
        username: nextUsername,
        displayName: displayName.trim(),
      });
      Alert.alert('Account created', 'Check your email to confirm the signup if required.');
    } catch (error: any) {
      Alert.alert('Sign up failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
        <View className="gap-3">
          <Text className="text-3xl font-bold text-ink dark:text-white">Join MealPins</Text>
          <Text className="text-base text-ink-600 dark:text-slate-300">
            Drop meals on the map and discover today’s bites.
          </Text>
        </View>

        <View className="mt-10 gap-5">
          <Input label="Display name" value={displayName} onChangeText={setDisplayName} />
          <Input label="Username" autoCapitalize="none" value={username} onChangeText={setUsername} />
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button label="Create account" onPress={handleSignUp} loading={loading} />
        </View>

        <Pressable onPress={() => navigation.goBack()} className="mt-8">
          <Text className="text-center text-sm text-ink-600 dark:text-slate-300">
            Already have an account? <Text className="font-semibold text-brand">Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
