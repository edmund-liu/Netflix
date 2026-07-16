import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Title } from '../types';
import PosterCard from './PosterCard';

interface Props {
  label: string;
  titles: Title[];
  onPressTitle: (title: Title) => void;
}

export default function ContentRow({ label, titles, onPressTitle }: Props) {
  if (titles.length === 0) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        horizontal
        data={titles}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <PosterCard title={item} onPress={onPressTitle} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
});
