import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useThemePreference } from '../providers/ThemeProvider';

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const { resolvedScheme } = useThemePreference();
  const isDark = resolvedScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarSafeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          height: 72,
          borderTopWidth: 0,
          backgroundColor: isDark ? '#0B0F1A' : '#FFFFFF',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0,
          paddingHorizontal: 12,
          paddingBottom: insets.bottom,
          paddingTop: 12,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: isDark ? '#000000' : '#0F172A',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        },
        tabBarIcon: ({ focused }) => {
          const iconSize = 24;
          const iconColor = focused ? '#5E7D63' : isDark ? '#94A3B8' : '#64748B';

          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            Create: 'add',
            Profile: focused ? 'person' : 'person-outline',
          };

          return <Ionicons name={iconMap[route.name]} size={iconSize} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Create" component={CreatePostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
