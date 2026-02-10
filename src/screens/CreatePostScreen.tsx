import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { createPost } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

export default function CreatePostScreen({ navigation }: any) {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

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

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!imageUri || !description || !locationName || latitude == null || longitude == null) {
      Alert.alert('Missing info', 'Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      await createPost({
        userId: user.id,
        imageUri,
        title: '',
        description,
        locationName,
        latitude,
        longitude,
      });
      Alert.alert('Posted!', 'Your meal is live on today’s map.');
      setImageUri(null);
      setDescription('');
      setLocationName('');
      setLatitude(null);
      setLongitude(null);
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Could not post', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-surface px-6 dark:bg-surface-dark"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 64,
        paddingBottom: imageUri ? 32 : 64,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-semibold text-ink dark:text-white">Create Post</Text>
      <View style={{ flex: 1, justifyContent: imageUri ? 'flex-start' : 'center' }}>
        {!imageUri ? (
          <View className="mt-8 gap-4">
            <Card className="items-center gap-4 py-10">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                <Ionicons name="camera" size={26} color="#5E7D63" />
              </View>
              <Text className="text-base font-semibold text-ink dark:text-slate-100">
                Add a photo of your meal
              </Text>
              <Text className="text-sm text-ink-600 dark:text-slate-400">
                Use the camera or pick from your library.
              </Text>
            </Card>
            <Button label="Take Photo" onPress={() => pickImage(true)} />
            <Button
              label="Choose from Library"
              variant="secondary"
              onPress={() => pickImage(false)}
            />
            <Button label="Cancel" variant="ghost" onPress={() => navigation.navigate('Home')} />
          </View>
        ) : (
          <View className="mt-6 gap-6">
            <Image source={{ uri: imageUri }} className="h-56 w-full rounded-3xl" />
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
              <Button
                label="Use GPS"
                variant="secondary"
                onPress={useCurrentLocation}
                className="flex-1"
              />
              <Button
                label="Geocode"
                variant="ghost"
                onPress={geocodeLocation}
                className="flex-1"
              />
            </View>
            <Button label="Publish" onPress={handleSubmit} loading={loading} />
            <Button label="Change Photo" variant="ghost" onPress={() => setImageUri(null)} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
