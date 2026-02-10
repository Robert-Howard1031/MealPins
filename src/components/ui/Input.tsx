import React from 'react';
import { Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';

import { cn } from '../../lib/cn';
import { font } from '../../lib/typography';

type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
};

export function Input({ label, error, className, labelStyle, inputStyle, ...props }: InputProps) {
  const resolvedLabelStyle = labelStyle ? [font.medium, labelStyle] : font.medium;
  const resolvedInputStyle = inputStyle ? [font.regular, inputStyle] : font.regular;

  return (
    <View className="gap-2">
      {label ? (
        <Text
          className="text-sm font-medium text-ink-600 dark:text-slate-300"
          style={resolvedLabelStyle}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#94A3B8"
        className={cn(
          'h-12 rounded-2xl border border-ink-300 bg-white px-4 text-base text-ink shadow-sm dark:border-slate-700 dark:bg-surface-darkMuted dark:text-slate-100',
          className
        )}
        style={resolvedInputStyle}
        {...props}
      />
      {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
