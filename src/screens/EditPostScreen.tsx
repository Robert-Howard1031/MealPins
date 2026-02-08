import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { updatePost } from '../lib/api';
import type { Post } from '../lib/types';

export default function EditPostScreen({ navigation, route }: { navigation: any; route: any }) {
  const { post } = route.params as { post: Post };

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [locationName, setLocationName] = useState(post.location_name);
  const [latitude, setLatitude] = useState(post.latitude);
  const [longitude, setLongitude] = useState(post.longitude);
  const [loading, setLoading] = useState(false);

  const useCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location required', 'Enable location to autofill.');
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    setLatitude(current.coords.latitude);
    setLongitude(current.coords.longitude);

    const placemarks = await Location.reverseGeocodeAsync({
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    });

    if (placemarks?.[0]) {
      const mark = placemarks[0];
      const name = [mark.name, mark.city, mark.region].filter(Boolean).join(', ');
      setLocationName(name || 'Current location');
    } else {
      setLocationName('Current location');
    }
  };

  const geocodeLocation = async () => {
    if (!locationName) {
      Alert.alert('Location required', 'Enter an address or place name.');
      return;
    }

    const results = await Location.geocodeAsync(locationName);
    if (!results?.length) {
      Alert.alert('Location not found', 'Try a different location.');
      return;
    }
    setLatitude(results[0].latitude);
    setLongitude(results[0].longitude);
  };

  const handleSave = async () => {
    if (!title || !description || !locationName) {
      Alert.alert('Missing info', 'Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      await updatePost(post.id, {
        title,
        description,
        location_name: locationName,
        latitude,
        longitude,
      });
      Alert.alert('Updated', 'Your post has been updated.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Update failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface px-6 pt-16 dark:bg-surface-dark">
      <View className="mb-6 flex-row items-center gap-3">
        <Ionicons name="create-outline" size={20} color="#FF6B35" />
        <Text className="text-2xl font-semibold text-ink dark:text-white">Edit Post</Text>
      </View>

      <Image source={{ uri: post.image_url }} className="h-60 w-full rounded-3xl" />
      <View className="mt-6 gap-5">
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          className="h-24 py-3"
        />
        <Input
          label="Location"
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Address or place name"
        />
        <View className="flex-row gap-3">
          <Button label="Use GPS" variant="secondary" onPress={useCurrentLocation} className="flex-1" />
          <Button label="Geocode" variant="ghost" onPress={geocodeLocation} className="flex-1" />
        </View>
        <Button label="Save Changes" onPress={handleSave} loading={loading} />
        <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
