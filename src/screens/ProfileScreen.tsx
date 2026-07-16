import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useDownloads } from '../context/DownloadsContext';
import { colors, radii, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { records } = useDownloads();
  const downloadedCount = Object.values(records).filter(
    (r) => r.state === 'downloaded'
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {(user?.name?.[0] ?? '?').toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.providerBadge}>
            <Ionicons
              name={user?.provider === 'google' ? 'logo-google' : 'person-outline'}
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.providerText}>
              {user?.provider === 'google' ? 'Google account' : 'Demo account'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statRow}>
        <Ionicons name="download" size={20} color={colors.text} />
        <Text style={styles.statText}>
          {downloadedCount} title{downloadedCount === 1 ? '' : 's'} downloaded for
          offline viewing
        </Text>
      </View>

      <Pressable style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginVertical: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  providerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signOut: {
    marginTop: spacing.xl,
    borderColor: colors.textMuted,
    borderWidth: 1,
    borderRadius: radii.sm,
    alignItems: 'center',
    paddingVertical: 12,
  },
  signOutText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
