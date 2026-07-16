# Netflix Web (Clone)

A netflix.com-style web app built with **Vite + React (TypeScript)** — the web companion to the Expo mobile app at the repo root. Same catalog, same features.

## Features

- 🎬 **netflix.com look & feel** — fixed top nav that darkens on scroll, full-bleed hero billboard with Play / More Info, horizontal rows with hover-zoom cards, title detail modal, poster-collage sign-in page
- 🔐 **Google sign-up / sign-in** — the official "Continue with Google" button via Google Identity Services; first sign-in creates the account, later ones sign you back in. A demo account works before OAuth is configured.
- ⬇️ **Offline downloads (in-app only)** — videos are fetched and stored as Blobs in **IndexedDB**, which is sandboxed to this site's origin: they never exist as ordinary files on disk, no other site or app can read them, and the app exposes no export/save path. Playback uses a transient `blob:` URL revoked when the player closes, and the player disables the browser's download control.
- ▶️ In-app player (streams online titles, plays downloaded ones from IndexedDB), search, downloads manager with progress

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Configuring Google Sign-In

1. In the [Google Cloud Console](https://console.cloud.google.com/) create an **OAuth Web application** client ID, adding your origins (e.g. `http://localhost:5173`) to *Authorized JavaScript origins*.
2. Copy `.env.example` to `.env` and set:

   ```
   VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   ```

3. Restart the dev server — the official Google button appears on the sign-in page.

Until then the app shows a hint and offers the built-in demo account.

## Structure

```
src/
  main.tsx                     entry (router + providers)
  App.tsx                      auth gate + routes (/ /search /downloads /watch/:id)
  auth/AuthContext.tsx         Google Identity Services + session persistence
  offline/DownloadsContext.tsx IndexedDB download store (progress, cancel, remove)
  data/catalog.ts              shared demo catalog (same as mobile)
  components/                  NavBar, Billboard, Row, TitleCard, TitleModal
  pages/                       Login, Browse, Search, Downloads, Watch
  index.css                    netflix.com-style theme
```

> The same caveat as mobile applies: origin sandboxing plus no export path keeps downloads in-app for normal use, but client-side storage is not DRM. Studio-grade protection would use Encrypted Media Extensions (Widevine/FairPlay).
