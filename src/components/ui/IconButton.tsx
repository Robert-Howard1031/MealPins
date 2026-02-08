import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { cn } from '../../lib/cn';

type IconButtonProps = PressableProps & {
  className?: string;
};

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <Pressable
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-surface-darkMuted/90',
        className
      )}
      {...props}
    />
  );
}
