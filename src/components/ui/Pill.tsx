import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type PillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  isDark?: boolean;
};

export function Pill({ label, active, onPress, isDark = false }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        active
          ? {
              backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
              shadowOpacity: 0.18,
            }
          : {
              backgroundColor: isDark ? 'rgba(20,26,42,0.8)' : 'rgba(255,255,255,0.85)',
            },
      ]}
    >
      <Text
        style={[
          styles.text,
          active
            ? { color: isDark ? '#0F172A' : '#FFFFFF' }
            : { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
