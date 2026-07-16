import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { UserAccount } from '../types';

// Required so the OAuth browser tab can hand the result back to the app.
WebBrowser.maybeCompleteAuthSession();

const USER_KEY = 'netflix.user';
const TOKEN_KEY = 'netflix.google.accessToken';

interface AuthContextValue {
  user: UserAccount | null;
  initializing: boolean;
  signingIn: boolean;
  /** True when Google OAuth client IDs are configured in app.json. */
  googleConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface GoogleAuthConfig {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

function readGoogleConfig(): GoogleAuthConfig {
  const extra = (Constants.expoConfig?.extra ?? {}) as {
    googleAuth?: GoogleAuthConfig;
  };
  return extra.googleAuth ?? {};
}

async function persistToken(token: string | null): Promise<void> {
  // SecureStore is unavailable on web; fall back to AsyncStorage there.
  const useSecure = Platform.OS !== 'web';
  if (token === null) {
    if (useSecure) await SecureStore.deleteItemAsync(TOKEN_KEY);
    else await AsyncStorage.removeItem(TOKEN_KEY);
  } else if (useSecure) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

async function fetchGoogleProfile(accessToken: string): Promise<UserAccount> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to load Google profile (HTTP ${res.status})`);
  }
  const profile = (await res.json()) as {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
  };
  return {
    id: profile.sub,
    name: profile.name ?? profile.email ?? 'Google user',
    email: profile.email ?? '',
    photoUrl: profile.picture,
    provider: 'google',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const googleConfig = useMemo(readGoogleConfig, []);
  const googleConfigured = Boolean(
    googleConfig.webClientId || googleConfig.iosClientId || googleConfig.androidClientId
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: googleConfig.webClientId,
    iosClientId: googleConfig.iosClientId,
    androidClientId: googleConfig.androidClientId,
    scopes: ['openid', 'profile', 'email'],
  });

  // Restore a persisted session on launch.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (raw) setUser(JSON.parse(raw) as UserAccount);
      } catch {
        // Corrupt session data — start signed out.
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  // Handle the OAuth redirect result.
  useEffect(() => {
    if (response?.type !== 'success') {
      if (response) setSigningIn(false);
      return;
    }
    const accessToken = response.authentication?.accessToken;
    if (!accessToken) {
      setSigningIn(false);
      return;
    }
    (async () => {
      try {
        const account = await fetchGoogleProfile(accessToken);
        await persistToken(accessToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(account));
        setUser(account);
      } catch (err) {
        console.warn('Google sign-in failed:', err);
      } finally {
        setSigningIn(false);
      }
    })();
  }, [response]);

  const signInWithGoogle = useCallback(async () => {
    if (!request) return;
    setSigningIn(true);
    try {
      await promptAsync();
    } catch (err) {
      console.warn('Google sign-in could not start:', err);
      setSigningIn(false);
    }
  }, [promptAsync, request]);

  const signInAsDemo = useCallback(async (name = 'Demo User') => {
    const account: UserAccount = {
      id: 'demo',
      name,
      email: 'demo@example.com',
      provider: 'demo',
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(USER_KEY);
    await persistToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signingIn,
      googleConfigured,
      signInWithGoogle,
      signInAsDemo,
      signOut,
    }),
    [user, initializing, signingIn, googleConfigured, signInWithGoogle, signInAsDemo, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
