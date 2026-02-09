import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export const appColors = {
  light: {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    primary: '#5E7D63',
  },
  dark: {
    background: '#0B0F1A',
    card: '#141A2A',
    text: '#F8FAFC',
    border: '#1E293B',
    primary: '#5E7D63',
  },
};

export type AppScheme = 'light' | 'dark';

export function getNavigationTheme(scheme: AppScheme): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const palette = appColors[scheme];
  return {
    ...base,
    colors: {
      ...base.colors,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.border,
      primary: palette.primary,
    },
  };
}
