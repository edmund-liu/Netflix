import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DownloadButton from '../components/DownloadButton';
import { useDownloads } from '../context/DownloadsContext';
import { getTitle } from '../data/catalog';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, radii, spacing } from '../theme';

const { width } = Dimensions.get('window');

export default function TitleDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'TitleDetail'>) {
  const title = getTitle(route.params.titleId);
  const { getRecord } = useDownloads();

  if (!title) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Title not found.</Text>
      </View>
    );
  }

  const downloaded = getRecord(title.id)?.state === 'downloaded';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View>
        <Image source={{ uri: title.backdropUrl }} style={styles.backdrop} />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={styles.backdropFade}
        />
        <Pressable style={styles.close} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{title.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaYear}>{title.year}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{title.maturityRating}</Text>
          </View>
          <Text style={styles.metaDuration}>{title.durationMinutes} min</Text>
          {downloaded && (
            <View style={styles.offlineBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.offlineText}>Available offline</Text>
            </View>
          )}
        </View>

        <Pressable
          style={styles.playButton}
          onPress={() => navigation.navigate('Player', { titleId: title.id })}
        >
          <Ionicons name="play" size={22} color="#000" />
          <Text style={styles.playText}>{downloaded ? 'Play Offline' : 'Play'}</Text>
        </Pressable>

        <DownloadButton title={title} />

        <Text style={styles.description}>{title.description}</Text>
        <Text style={styles.genres}>Genres: {title.genres.join(', ')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  backdrop: {
    width,
    height: width * 0.56,
    backgroundColor: colors.surfaceLight,
  },
  backdropFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  close: {
    position: 'absolute',
    top: 48,
    right: spacing.md,
    backgroundColor: colors.overlay,
    borderRadius: radii.pill,
    padding: 4,
  },
  body: {
    paddingHorizontal: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaYear: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  ratingBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  ratingText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  metaDuration: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offlineText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    borderRadius: radii.sm,
    paddingVertical: 10,
    marginTop: spacing.md,
    gap: 6,
  },
  playText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  genres: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    color: colors.text,
  },
});
