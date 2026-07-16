import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDownloads } from '../context/DownloadsContext';
import { colors, spacing } from '../theme';
import { Title } from '../types';

interface Props {
  title: Title;
}

export default function DownloadButton({ title }: Props) {
  const { getRecord, startDownload, cancelDownload, removeDownload } = useDownloads();
  const record = getRecord(title.id);
  const state = record?.state ?? 'not_downloaded';

  if (state === 'downloading' || state === 'queued') {
    const pct = Math.round((record?.progress ?? 0) * 100);
    return (
      <Pressable style={styles.button} onPress={() => cancelDownload(title.id)}>
        <View style={styles.row}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.label}>Downloading… {pct}% (tap to cancel)</Text>
        </View>
      </Pressable>
    );
  }

  if (state === 'downloaded') {
    return (
      <Pressable style={styles.button} onPress={() => removeDownload(title.id)}>
        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          <Text style={styles.label}>Downloaded (tap to remove)</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.button} onPress={() => startDownload(title)}>
      <View style={styles.row}>
        <Ionicons
          name={state === 'failed' ? 'refresh' : 'download-outline'}
          size={22}
          color={colors.text}
        />
        <Text style={styles.label}>{state === 'failed' ? 'Retry Download' : 'Download'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
