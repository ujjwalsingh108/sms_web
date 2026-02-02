
# Mobile Migration Plan — SMS Web

This document summarizes practical options to convert the existing Next.js web app into mobile apps (Android + iOS), trade-offs, quick commands, and a short rollout checklist.

## Recommendation Summary

- Fastest, minimal rewrite: **PWA + Capacitor** — reuse current UI, ship quickly, limited native UX.
- Best native UX & performance: **React Native (Expo)** + `react-native-web` — requires UI rewrite but gives native feel.
- Progressive approach: Start with PWA/Capacitor, then reimplement critical screens in RN.

## Option 1 — PWA + Capacitor (fastest)

- Pros: Reuse Next.js UI, fastest to stores, low dev effort.
- Cons: Runs inside a WebView (some native limits), not 100% native UI.

Quick steps (example):

```bash
npm install @capacitor/core @capacitor/cli
npx cap init sms-web-app com.yourschool.sms
# Build web assets — either static export or a hosted URL
npm run build
# If using static export, ensure output is in `out` or `build` and point Capacitor to it
npx cap add android
npx cap add ios
npx cap copy
npx cap open android
```

Notes:
- For Next.js you can either export static pages (`next export`) or host the app and point Capacitor WebView to the hosted URL.
- Use native plugins for camera, files, notifications when needed.

## Option 2 — React Native with Expo (best native UX)

- Pros: Native components and performance, rich ecosystem, Expo speeds iteration.
- Cons: Requires rewriting UI; effort to align styling and behavior.

Scaffold (quick):

```bash
npx create-expo-app sms-mobile
cd sms-mobile
npm install @supabase/supabase-js
expo start
```

Notes:
- Use `react-native-web` to share UI where possible.
- Keep Supabase/Next.js as the API layer or use the Supabase client directly from RN.
- For production native builds use EAS (`eas build`) or cloud macOS for iOS.

## Option 3 — Hybrid / Progressive Migration

- Pros: Ship fast with PWA, migrate high-value screens to native later.

## Minimal First-Release Scope (suggested)

- Authentication & profile
- Student list and detail view
- Infirmary: create medical record & checkup forms
- Notifications (basic push/local)
- Offline sync for small datasets (optional)

## Checklist for a Production Release

- [ ] Decide approach (PWA vs RN) and pin first-release scope
- [ ] Prototype one E2E flow (login → list → detail → create)
- [ ] Centralize API & Supabase logic into shared modules
- [ ] Implement secure token storage (`expo-secure-store` or `react-native-keychain`)
- [ ] Add push notifications & permission flow
- [ ] Configure builds: Android keystore, Apple provisioning, CI pipeline (EAS/Github Actions)
- [ ] QA on multiple devices + accessibility checks
- [ ] Submit to Play Store / App Store

## Infra & Platform Notes

- iOS builds require macOS or EAS cloud builds.
- App Store and Play Store require developer accounts and provisioning.
- Use secure storage for tokens; consider short-lived tokens + refresh endpoints.
- For heavy offline use, use local DB (SQLite or WatermelonDB) and background sync.

## Recommended Next Steps (I can help)

1. I can scaffold an **Expo prototype** with Supabase login + one form (estimate: 1–2 hours).
2. I can scaffold a **Capacitor wrapper** that loads the current Next.js app (estimate: 30–60 minutes).

Tell me which prototype to start and I will create the project scaffold and a short run guide.

---
Generated: January 30, 2026
