import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { cn } from '../../lib/cn';

type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-sm font-medium text-ink-600 dark:text-slate-300">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#94A3B8"
        className={cn(
          'h-12 rounded-2xl border border-ink-300 bg-white px-4 text-base text-ink shadow-sm dark:border-slate-700 dark:bg-surface-darkMuted dark:text-slate-100',
          className
        )}
        {...props}
      />
      {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
