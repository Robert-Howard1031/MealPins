import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../providers/AuthProvider';

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Sign in failed', error.message || 'Check your credentials.');
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
          <Text className="text-3xl font-bold text-ink dark:text-white">MealPins</Text>
          <Text className="text-base text-ink-600 dark:text-slate-300">
            Map-first daily meal drops.
          </Text>
        </View>

        <View className="mt-12 gap-6">
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button label="Sign in" onPress={handleSignIn} loading={loading} />
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')} className="mt-10">
          <Text className="text-center text-sm text-ink-600 dark:text-slate-300">
            New here? <Text className="font-semibold text-brand">Create an account</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
