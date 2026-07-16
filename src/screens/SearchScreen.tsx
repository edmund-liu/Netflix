import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchTitles, TITLES } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme';
import { Title } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => (query.trim() ? searchTitles(query) : TITLES),
    [query]
  );

  const renderItem = ({ item }: { item: Title }) => (
    <Pressable
      style={styles.result}
      onPress={() => navigation.navigate('TitleDetail', { titleId: item.id })}
    >
      <Image source={{ uri: item.posterUrl }} style={styles.thumb} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultMeta}>
          {item.year} • {item.genres.join(', ')}
        </Text>
      </View>
      <Ionicons name="play-circle-outline" size={30} color={colors.text} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Search films, genres…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      <Text style={styles.sectionLabel}>
        {query.trim() ? `Results for “${query.trim()}”` : 'Popular Searches'}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No titles match your search.</Text>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: 10,
    fontSize: 15,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    margin: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  thumb: {
    width: 110,
    height: 64,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
