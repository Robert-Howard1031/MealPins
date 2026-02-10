import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, TextStyle } from 'react-native';

import { cn } from '../../lib/cn';
import { font } from '../../lib/typography';
import { useThemePreference } from '../../providers/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  textStyle?: TextStyle;
  textClassName?: string;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  className,
  textStyle,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  const { resolvedScheme } = useThemePreference();
  const base =
    'h-12 items-center justify-center rounded-full px-6 shadow-sm active:opacity-80';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand',
    secondary: 'bg-surface-muted dark:bg-surface-darkMuted',
    ghost: 'bg-transparent border border-ink-300 dark:border-slate-700',
    danger: 'bg-red-500',
  };
  const textVariants: Record<ButtonVariant, string> = {
    primary: 'text-white',
    secondary: 'text-ink dark:text-slate-100',
    ghost: 'text-ink dark:text-slate-100',
    danger: 'text-white',
  };
  const indicatorColor =
    variant === 'secondary' || variant === 'ghost'
      ? resolvedScheme === 'dark'
        ? '#F8FAFC'
        : '#0F172A'
      : '#FFFFFF';

  const resolvedTextStyle = textStyle ? [font.semibold, textStyle] : font.semibold;

  return (
    <Pressable
      className={cn(base, variants[variant], disabled && 'opacity-50', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text
          className={cn('text-base font-semibold', textVariants[variant], textClassName)}
          style={resolvedTextStyle}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
