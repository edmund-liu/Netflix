import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';
import { Title } from '../types';

interface Props {
  title: Title;
  onPress: (title: Title) => void;
  width?: number;
}

export default function PosterCard({ title, onPress, width = 110 }: Props) {
  return (
    <Pressable
      onPress={() => onPress(title)}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: title.posterUrl }}
        style={[styles.poster, { width, height: width * 1.45 }]}
        resizeMode="cover"
      />
      {title.isOriginal && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>N</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 8,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
  },
  pressed: {
    opacity: 0.7,
  },
  poster: {
    borderRadius: radii.sm,
  },
  badge: {
    position: 'absolute',
    top: 4,
    left: 6,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
});
