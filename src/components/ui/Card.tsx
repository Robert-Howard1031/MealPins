import React from 'react';
import { View, ViewProps } from 'react-native';

import { cn } from '../../lib/cn';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        'rounded-3xl border border-ink-300/40 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-surface-darkMuted',
        className
      )}
      {...props}
    />
  );
}
