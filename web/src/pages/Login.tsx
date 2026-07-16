import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { TITLES } from '../data/catalog';

export default function Login() {
  const { googleConfigured, mountGoogleButton, signInAsDemo } = useAuth();
  const googleSlot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (googleSlot.current) mountGoogleButton(googleSlot.current);
  }, [mountGoogleButton]);

  // Poster collage background, like netflix.com's landing page.
  const collage = [...TITLES, ...TITLES].slice(0, 24);

  return (
    <div className="login">
      <div className="login-bg" aria-hidden>
        {collage.map((t, i) => (
          <img key={`${t.id}-${i}`} src={t.posterUrl} alt="" />
        ))}
      </div>
      <div className="login-shade" aria-hidden />
      <header className="login-header">
        <span className="login-logo">NETFLIX</span>
      </header>
      <div className="login-card">
        <h1>Sign In</h1>
        <p className="login-sub">
          Unlimited films, series and more. Watch anywhere — download and watch
          offline, right inside the app.
        </p>
        <div className="google-slot" ref={googleSlot} />
        {!googleConfigured && (
          <p className="login-hint">
            Google sign-in needs a client ID: set <code>VITE_GOOGLE_CLIENT_ID</code> in{' '}
            <code>web/.env</code> (see README). Until then, use the demo account below.
          </p>
        )}
        <button className="btn-demo" onClick={signInAsDemo}>
          Continue with Demo Account
        </button>
        <p className="login-terms">
          Signing in with Google creates your account automatically the first time —
          no separate sign-up needed.
        </p>
      </div>
    </div>
  );
}
