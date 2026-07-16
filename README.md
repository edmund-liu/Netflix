# Netflix Mobile (Clone)

A Netflix-style mobile app built with **Expo / React Native (TypeScript)** for iOS and Android.

## Features

- 🎬 **Netflix-style UI** — hero banner, horizontal content rows, dark theme, detail pages
- 🔐 **Google sign-up / sign-in** — one "Continue with Google" flow via OAuth (`expo-auth-session`); the first sign-in creates the account, later sign-ins reuse it. A demo account is included so you can use the app before configuring OAuth.
- ⬇️ **Offline downloads (in-app only)** — download any title and watch it without internet, from the **Downloads** tab or the title page
- ▶️ **In-app video player** — full-screen landscape playback (`expo-video`), streams online titles and plays downloaded ones from local storage
- 🔎 Search across the catalog, plus a profile screen with sign-out

## Why downloads can't be played outside the app

Downloaded videos are intentionally locked to the app:

1. **OS-sandboxed private storage** — files are saved to the app's private container (`documentDirectory`): on iOS the app sandbox, on Android internal storage at `/data/data/<package>/files`. No other app, file manager, gallery, or media scanner can read them on a stock device.
2. **Obfuscated file names** — files are stored as a SHA-256 hash with a private `.nfv` extension (no MIME type association), so nothing identifies or auto-plays them as video even if the storage were browsed.
3. **No export path** — the app has no share sheet, "open with", content provider, or export feature for downloaded files. The only playback surface is the in-app player.
4. **`android:allowBackup=false`** — downloads can't be extracted through ADB/cloud backups on Android.

> Note: like all client-side protection (including real streaming apps), this is defense-in-depth, not absolute security — a rooted/jailbroken device can read any app's sandbox. For studio-grade protection you would add DRM (Widevine/FairPlay) via a custom player module.

## Getting started

```bash
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app (Android/iOS), or press `a` / `i` to launch an emulator/simulator.

> Google sign-in and secure storage need native modules, so for the full experience use a development build: `npx expo run:android` or `npx expo run:ios`.

## Configuring Google Sign-In

Until OAuth is configured, the Google button is disabled and the app tells you to use the demo account.

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/) and open **APIs & Services → Credentials**.
2. Create OAuth client IDs:
   - **Web application** (used by Expo Go / web) → `webClientId`
   - **iOS** with your bundle ID `com.example.netflixmobile` → `iosClientId`
   - **Android** with package `com.example.netflixmobile` and your keystore's SHA-1 → `androidClientId`
3. Put them into `app.json`:

```json
"extra": {
  "googleAuth": {
    "webClientId": "xxx.apps.googleusercontent.com",
    "iosClientId": "xxx.apps.googleusercontent.com",
    "androidClientId": "xxx.apps.googleusercontent.com"
  }
}
```

4. Restart the dev server. "Continue with Google" now signs you up / in with your Google account; your name, e-mail and avatar appear on the Profile tab.

## Project structure

```
App.tsx                        entry point (providers + navigator)
src/
  data/catalog.ts              demo catalog (public sample videos) — swap for your API
  context/AuthContext.tsx      Google OAuth + session persistence
  context/DownloadsContext.tsx download manager (private storage, progress, persistence)
  navigation/RootNavigator.tsx auth gate, tabs (Home/Search/Downloads/Profile), stack
  screens/                     SignIn, Home, Search, Downloads, Profile, TitleDetail, Player
  components/                  HeroBanner, ContentRow, PosterCard, DownloadButton
  theme.ts                     Netflix-style colors/spacing
```

## Demo content

The catalog uses Google's public sample-video bucket (Blender Foundation open-movie shorts and promo clips) so streaming and downloads work out of the box with no backend. Replace `src/data/catalog.ts` with your own content API when ready.
