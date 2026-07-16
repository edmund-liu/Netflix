import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDownloads } from '../context/DownloadsContext';
import { getTitle } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme';
import { DownloadRecord, Title } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Row {
  record: DownloadRecord;
  title: Title;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
}

export default function DownloadsScreen() {
  const navigation = useNavigation<Nav>();
  const { records, removeDownload, cancelDownload } = useDownloads();

  const rows: Row[] = useMemo(
    () =>
      Object.values(records)
        .map((record) => ({ record, title: getTitle(record.titleId) }))
        .filter((r): r is Row => Boolean(r.title))
        .sort((a, b) => (b.record.downloadedAt ?? 0) - (a.record.downloadedAt ?? 0)),
    [records]
  );

  const renderItem = ({ item }: { item: Row }) => {
    const { record, title } = item;
    const ready = record.state === 'downloaded';
    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          ready && navigation.navigate('Player', { titleId: title.id })
        }
      >
        <Image source={{ uri: title.posterUrl }} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.name}>{title.name}</Text>
          <Text style={styles.meta}>
            {ready
              ? `${formatBytes(record.bytesTotal || record.bytesWritten)} • Ready to watch offline`
              : record.state === 'downloading'
                ? `Downloading… ${Math.round(record.progress * 100)}%`
                : record.state}
          </Text>
          {!ready && record.state === 'downloading' && (
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${record.progress * 100}%` }]}
              />
            </View>
          )}
        </View>
        {ready ? (
          <Ionicons name="play-circle" size={34} color={colors.text} />
        ) : null}
        <Pressable
          hitSlop={8}
          onPress={() =>
            ready ? removeDownload(title.id) : cancelDownload(title.id)
          }
        >
          <Ionicons name="trash-outline" size={22} color={colors.textMuted} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Downloads</Text>
      <View style={styles.notice}>
        <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
        <Text style={styles.noticeText}>
          Downloads are stored in the app's private storage and can only be
          played here — they are not visible to other apps.
        </Text>
      </View>
      {rows.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="download-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No downloads yet</Text>
          <Text style={styles.emptyText}>
            Films you download appear here, ready to watch without internet.
          </Text>
          <Pressable
            style={styles.browseButton}
            onPress={() => navigation.navigate('Tabs')}
          >
            <Text style={styles.browseText}>Find Something to Download</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.record.titleId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    margin: spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  noticeText: {
    color: colors.textMuted,
    fontSize: 12,
    flex: 1,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  thumb: {
    width: 110,
    height: 64,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.primary,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: colors.text,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  browseText: {
    color: '#000',
    fontWeight: '700',
  },
});
