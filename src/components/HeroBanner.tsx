import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, spacing } from '../theme';
import { Title } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  title: Title;
  onPlay: (title: Title) => void;
  onInfo: (title: Title) => void;
}

export default function HeroBanner({ title, onPlay, onInfo }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: title.backdropUrl }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', colors.background]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{title.name}</Text>
        <Text style={styles.genres}>{title.genres.join(' • ')}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.playButton} onPress={() => onPlay(title)}>
            <Ionicons name="play" size={22} color="#000" />
            <Text style={styles.playText}>Play</Text>
          </Pressable>
          <Pressable style={styles.infoButton} onPress={() => onInfo(title)}>
            <Ionicons name="information-circle-outline" size={22} color={colors.text} />
            <Text style={styles.infoText}>Info</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: width * 1.2,
    justifyContent: 'flex-end',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: width * 1.2,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
  },
  genres: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    gap: 6,
  },
  playText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(109,109,110,0.7)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    gap: 6,
  },
  infoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
