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

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const headingStyle = { fontFamily: 'Sora_700Bold' };
  const titleStyle = { fontFamily: 'Sora_600SemiBold' };
  const bodyStyle = { fontFamily: 'Sora_400Regular' };
  const labelStyle = { fontFamily: 'Sora_500Medium' };
  const inputStyle = { fontFamily: 'Sora_400Regular' };
  const buttonTextStyle = { fontFamily: 'Sora_600SemiBold' };

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
      <View className="flex-1 bg-[#EEF3ED] dark:bg-[#0B1220]">
        <View className="absolute -top-24 -left-16 h-56 w-56 rounded-full bg-brand/20" />
        <View className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-brand/15" />
        <View className="absolute top-16 right-12 h-3 w-3 rounded-full bg-brand/70" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <View className="rounded-[32px] bg-white/90 p-6 shadow-xl dark:bg-surface-darkMuted/90">
              <View className="items-center gap-3">
                <Text
                  className="text-xs uppercase tracking-[2px] text-ink-500 dark:text-slate-400"
                  style={headingStyle}
                >
                  MealPins
                </Text>
                <Text className="text-2xl text-ink dark:text-white" style={titleStyle}>
                  Welcome Back
                </Text>
              </View>

              <View className="mt-5 h-px bg-ink-300/50 dark:bg-slate-700/60" />

              <View className="mt-6 gap-4">
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
                  label="Sign in"
                  onPress={handleSignIn}
                  loading={loading}
                  textStyle={buttonTextStyle}
                />
              </View>

              <Pressable onPress={() => navigation.navigate('SignUp')} className="mt-6">
                <Text className="text-center text-sm text-ink-600 dark:text-slate-300" style={bodyStyle}>
                  New here?{' '}
                  <Text className="text-brand" style={titleStyle}>
                    Create an account
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
