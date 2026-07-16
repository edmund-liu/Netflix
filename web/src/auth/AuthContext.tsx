/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { UserAccount } from '../types';

const USER_KEY = 'netflix.web.user';

/** Google Identity Services client ID; set in web/.env as VITE_GOOGLE_CLIENT_ID. */
export const GOOGLE_CLIENT_ID: string =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? '';

interface GsiCredentialResponse {
  credential: string;
}

interface GsiButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  shape?: 'rectangular' | 'pill';
  width?: number;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GsiCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: GsiButtonConfig) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface AuthContextValue {
  user: UserAccount | null;
  googleConfigured: boolean;
  /** Renders the official "Sign in with Google" button into the given element. */
  mountGoogleButton: (el: HTMLElement) => void;
  signInAsDemo: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Decode the payload of a Google ID token (JWT). Display-only usage. */
function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json) as Record<string, unknown>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserAccount) : null;
    } catch {
      return null;
    }
  });
  const [gsiReady, setGsiReady] = useState(false);

  const googleConfigured = GOOGLE_CLIENT_ID.length > 0;

  const handleCredential = useCallback((response: GsiCredentialResponse) => {
    try {
      const payload = decodeJwtPayload(response.credential);
      const account: UserAccount = {
        id: String(payload.sub ?? 'google'),
        name: String(payload.name ?? payload.email ?? 'Google user'),
        email: String(payload.email ?? ''),
        photoUrl: typeof payload.picture === 'string' ? payload.picture : undefined,
        provider: 'google',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(account));
      setUser(account);
    } catch (err) {
      console.warn('Failed to process Google credential:', err);
    }
  }, []);

  // Initialize Google Identity Services once its script has loaded.
  useEffect(() => {
    if (!googleConfigured) return;
    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
        });
        setGsiReady(true);
      } else {
        setTimeout(tryInit, 300);
      }
    };
    tryInit();
    return () => {
      cancelled = true;
    };
  }, [googleConfigured, handleCredential]);

  const mountGoogleButton = useCallback(
    (el: HTMLElement) => {
      if (!gsiReady || !window.google) return;
      window.google.accounts.id.renderButton(el, {
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
      });
    },
    [gsiReady]
  );

  const signInAsDemo = useCallback(() => {
    const account: UserAccount = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      provider: 'demo',
    };
    localStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    window.google?.accounts.id.disableAutoSelect();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, googleConfigured, mountGoogleButton, signInAsDemo, signOut }),
    [user, googleConfigured, mountGoogleButton, signInAsDemo, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
