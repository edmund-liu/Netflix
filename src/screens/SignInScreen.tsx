import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, radii, spacing } from '../theme';

/**
 * Combined sign-up / sign-in screen. Google OAuth creates the account on
 * first use and signs in on subsequent uses — same button, same flow.
 */
export default function SignInScreen() {
  const { signInWithGoogle, signInAsDemo, signingIn, googleConfigured } = useAuth();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2b0000', colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.logo}>NETFLIX</Text>

        <View style={styles.center}>
          <Text style={styles.headline}>Unlimited films, series and more</Text>
          <Text style={styles.subhead}>
            Watch anywhere. Download and watch offline, right inside the app.
          </Text>

          <Pressable
            style={[styles.googleButton, signingIn && styles.disabled]}
            onPress={signInWithGoogle}
            disabled={signingIn || !googleConfigured}
          >
            {signingIn ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#000" />
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          {!googleConfigured && (
            <Text style={styles.configHint}>
              Google sign-in needs OAuth client IDs in app.json → extra.googleAuth
              (see README). Use the demo account below until then.
            </Text>
          )}

          <Pressable style={styles.demoButton} onPress={() => signInAsDemo()}>
            <Text style={styles.demoText}>Continue with Demo Account</Text>
          </Pressable>

          <Text style={styles.terms}>
            Signing in with Google creates your account automatically the first
            time — no separate sign-up needed.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  logo: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  headline: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subhead: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    borderRadius: radii.sm,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  googleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  configHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  demoButton: {
    alignItems: 'center',
    borderColor: colors.textMuted,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingVertical: 14,
  },
  demoText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  terms: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
