import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ContentRow from '../components/ContentRow';
import HeroBanner from '../components/HeroBanner';
import { CATALOG_ROWS, getTitle, HERO_TITLE_ID } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';
import { Title } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const hero = getTitle(HERO_TITLE_ID);

  const openDetail = (title: Title) =>
    navigation.navigate('TitleDetail', { titleId: title.id });
  const play = (title: Title) => navigation.navigate('Player', { titleId: title.id });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>N</Text>
        </View>
        {hero && <HeroBanner title={hero} onPlay={play} onInfo={openDetail} />}
        <View style={styles.rows}>
          {CATALOG_ROWS.map((row) => (
            <ContentRow
              key={row.id}
              label={row.label}
              titles={row.titleIds
                .map(getTitle)
                .filter((t): t is Title => Boolean(t))}
              onPressTitle={openDetail}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 48,
    left: spacing.md,
    zIndex: 10,
  },
  logo: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
  },
  rows: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
