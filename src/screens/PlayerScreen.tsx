import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDownloads } from '../context/DownloadsContext';
import { getTitle } from '../data/catalog';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, spacing } from '../theme';

/**
 * The ONLY playback surface for downloaded content. Offline files live in
 * app-private storage and are handed straight to the in-app player as a
 * local file URI — never through a share sheet, external intent, or
 * content provider, so they cannot be opened by any other app.
 */
export default function PlayerScreen({
  route,
  navigation,
}: RootStackScreenProps<'Player'>) {
  const title = getTitle(route.params.titleId);
  const { getLocalUri } = useDownloads();

  const localUri = title ? getLocalUri(title.id) : null;
  const source = localUri ?? title?.videoUrl ?? null;

  const player = useVideoPlayer(source, (p) => {
    p.play();
  });

  // Landscape while playing, restore on exit (native only).
  useEffect(() => {
    if (Platform.OS === 'web') return;
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(
      () => {}
    );
    return () => {
      ScreenOrientation.unlockAsync().catch(() => {});
    };
  }, []);

  if (!title) {
    return (
      <View style={styles.container}>
        <Text style={styles.missing}>Title not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture={false}
        nativeControls
      />
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </Pressable>
      <View style={styles.titleBar} pointerEvents="none">
        <Text style={styles.titleText}>{title.name}</Text>
        {localUri && (
          <View style={styles.offlinePill}>
            <Ionicons name="download" size={12} color={colors.text} />
            <Text style={styles.offlinePillText}>Playing offline</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    backgroundColor: colors.overlay,
    borderRadius: 999,
    padding: 4,
  },
  titleBar: {
    position: 'absolute',
    top: spacing.lg,
    alignSelf: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowRadius: 6,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.overlay,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  offlinePillText: {
    color: colors.text,
    fontSize: 11,
  },
  missing: {
    color: colors.text,
    textAlign: 'center',
    marginTop: 100,
  },
});
