import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useNWColorScheme } from 'nativewind';

import type { AppScheme } from '../lib/theme';

const STORAGE_KEY = 'mealpins.theme';

type ThemePreference = 'system' | AppScheme;

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedScheme: AppScheme;
  setTheme: (next: ThemePreference) => void;
  isHydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useNWColorScheme();
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeState(saved);
          setColorScheme(saved === 'system' ? 'system' : saved);
        }
      } finally {
        setHydrated(true);
      }
    };

    loadTheme();
  }, [setColorScheme]);

  const setTheme = async (next: ThemePreference) => {
    setThemeState(next);
    setColorScheme(next === 'system' ? 'system' : next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const resolvedScheme: AppScheme = colorScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo(
    () => ({ theme, resolvedScheme, setTheme, isHydrated }),
    [theme, resolvedScheme, isHydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used within ThemeProvider');
  }
  return context;
}
