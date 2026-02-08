import './global.css';
import 'react-native-url-polyfill/auto';

import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/providers/AuthProvider';
import { ThemeProvider, useThemePreference } from './src/providers/ThemeProvider';
import { getNavigationTheme } from './src/lib/theme';

function AppShell() {
  const { resolvedScheme } = useThemePreference();

  return (
    <NavigationContainer theme={getNavigationTheme(resolvedScheme)}>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
