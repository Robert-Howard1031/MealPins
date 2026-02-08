import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Pill } from '../components/ui/Pill';
import { PostPreviewCard } from '../components/PostPreviewCard';
import { fetchTodayPostsExplore, fetchTodayPostsFollowing, deletePost } from '../lib/api';
import type { Post } from '../lib/types';
import { useAuth } from '../providers/AuthProvider';
import { useThemePreference } from '../providers/ThemeProvider';
import { IconButton } from '../components/ui/IconButton';

const DEFAULT_REGION: Region = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

type Mode = 'explore' | 'following';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const { resolvedScheme } = useThemePreference();
  const isDark = resolvedScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('explore');
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const didPressMarker = useRef(false);
  const mapRef = useRef<MapView | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const loadLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const current = await Location.getCurrentPositionAsync({});
      const nextRegion = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 400);
    } catch (error) {
      console.warn('Location error', error);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data =
        mode === 'explore'
          ? await fetchTodayPostsExplore()
          : await fetchTodayPostsFollowing(user.id);
      setPosts(data);
    } catch (error) {
      console.warn(error);
      Alert.alert('Could not load posts', 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mode, user?.id]);

  useEffect(() => {
    loadLocation();
    loadPosts();
  }, [loadLocation, loadPosts]);

  const handleDelete = async (post: Post) => {
    Alert.alert('Delete post?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(post.id, post.image_url);
            setSelectedPost(null);
            loadPosts();
          } catch (error) {
            Alert.alert('Delete failed', 'Please try again.');
          }
        },
      },
    ]);
  };

  const mapMarkers = useMemo(
    () =>
      posts.map((post) => {
        const isSelected = selectedPost?.id === post.id;
        return (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.latitude, longitude: post.longitude }}
            onPress={() => {
              didPressMarker.current = true;
              setSelectedPost(post);
            }}
          >
            <View
              className={`rounded-2xl border-2 border-white bg-white shadow-lg dark:border-slate-800 ${
                isSelected ? 'scale-110' : ''
              }`}
            >
              <Image
                source={{ uri: post.image_url }}
                className="h-12 w-12 rounded-xl"
                resizeMode="cover"
              />
            </View>
          </Marker>
        );
      }),
    [posts, selectedPost?.id]
  );

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={() => {
          if (didPressMarker.current) {
            didPressMarker.current = false;
            return;
          }
          setSelectedPost(null);
        }}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton
      >
        {mapMarkers}
      </MapView>

      <View className="absolute left-0 right-0" style={{ top: insets.top + 12 }}>
        <View className="mx-5 flex-row items-center justify-between">
          <IconButton
            onPress={() =>
              setMapType((current) => (current === 'standard' ? 'satellite' : 'standard'))
            }
          >
            <Ionicons
              name={mapType === 'satellite' ? 'layers' : 'layers-outline'}
              size={18}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
          </IconButton>

          <View className="mx-4 flex-1 items-center">
            <View className="flex-row gap-2 rounded-full bg-white/80 p-2 shadow-md dark:bg-surface-darkMuted/80">
              <Pill
                label="Explore"
                active={mode === 'explore'}
                onPress={() => setMode('explore')}
                isDark={isDark}
              />
              <Pill
                label="Following"
                active={mode === 'following'}
                onPress={() => setMode('following')}
                isDark={isDark}
              />
            </View>
          </View>

          <IconButton onPress={loadLocation}>
            <Ionicons name="locate" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </IconButton>
        </View>
      </View>

      {loading ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : null}

      {selectedPost ? (
        <View className="absolute inset-0 items-center justify-center px-6">
          <View className="w-full max-w-md">
            <PostPreviewCard
              post={selectedPost}
              isOwner={selectedPost.user_id === user?.id}
              onPressPost={() => navigation.navigate('PostDetail', { post: selectedPost })}
              onPressUser={() =>
                navigation.navigate('UserProfile', { userId: selectedPost.user_id })
              }
              onEdit={() => navigation.navigate('EditPost', { post: selectedPost })}
              onDelete={() => handleDelete(selectedPost)}
            />
          </View>
        </View>
      ) : null}

      {posts.length === 0 && !loading ? (
        <View className="absolute inset-0 items-center justify-center px-8">
          <View
            className="rounded-3xl bg-white/90 p-6 shadow-lg dark:bg-surface-darkMuted/90"
            style={{ width: 280, height: 280 }}
          >
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg font-semibold text-ink dark:text-slate-100">
                No meals posted yet
              </Text>
              <Text className="mt-3 text-center text-sm text-ink-600 dark:text-slate-400">
                Be the first to drop a meal on today’s map.
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
