import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const headingStyle = { fontFamily: 'Sora_700Bold' };
  const titleStyle = { fontFamily: 'Sora_600SemiBold' };
  const bodyStyle = { fontFamily: 'Sora_400Regular' };
  const labelStyle = { fontFamily: 'Sora_500Medium' };
  const inputStyle = { fontFamily: 'Sora_400Regular' };
  const buttonTextStyle = { fontFamily: 'Sora_600SemiBold' };

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
      <View className="flex-1 bg-[#EEF3ED] dark:bg-[#0B1220]">
        <View className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-brand/20" />
        <View className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-brand/15" />
        <View className="absolute top-16 left-12 h-3 w-3 rounded-full bg-brand/70" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <View className="rounded-[32px] bg-white/90 p-6 shadow-xl dark:bg-surface-darkMuted/90">
              <View className="items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
                  <Ionicons name="sparkles" size={22} color="#5E7D63" />
                </View>
                <Text className="text-xl text-ink dark:text-white" style={headingStyle}>
                  Join MealPins
                </Text>
                <Text className="text-lg text-ink dark:text-white" style={titleStyle}>
                  Start dropping meals
                </Text>
                <Text className="text-center text-sm text-ink-600 dark:text-slate-300" style={bodyStyle}>
                  Create your profile and share today's bites with the map.
                </Text>
              </View>

              <View className="mt-6 gap-4">
                <Input
                  label="Display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
                <Input
                  label="Username"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
                <Input
                  label="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
                <Input
                  label="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
                <Button
                  label="Create account"
                  onPress={handleSignUp}
                  loading={loading}
                  textStyle={buttonTextStyle}
                />
              </View>

              <Pressable onPress={() => navigation.goBack()} className="mt-6">
                <Text className="text-center text-sm text-ink-600 dark:text-slate-300" style={bodyStyle}>
                  Already have an account?{' '}
                  <Text className="text-brand" style={titleStyle}>
                    Sign in
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
