# Roam Romance - Product Requirements Document

## Original Problem Statement
Build a Tinder-style dating app named "Roam Romance" as a native mobile app deployable to both Apple App Store and Google Play Store. Features include left/right swiping with slot machine sounds, multi-language support (11 languages), screenshot protection, subscription tiers, and a black & gold theme with sunset background.

## Tech Stack
- **Mobile App**: React Native + Expo (SDK 52) — builds for iOS, Android, and Web
- **Backend**: FastAPI + MongoDB
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Styling**: React Native StyleSheet
- **Audio**: Web Audio API (web), expo-av (native)
- **Deployment**: Expo EAS Build for app store submission

## What's Implemented

### Frontend (React Native / Expo)
- [x] Landing screen with auth (login/signup), logo, sunset background
- [x] Multi-step profile setup (6 steps: Gender, Age, Race, Details, Interests, Photos/Bio)
- [x] Discover screen with swipe cards (PanResponder + Animated API)
- [x] Matches screen with match list, avatars, unread indicators
- [x] Profile screen with user details, upgrade banner
- [x] Settings screen with discovery settings, language selector, logout
- [x] Subscription screen with 3 plan tiers (Plus, Gold, Platinum)
- [x] 11-language translation system (en, fr, de, ru, ar, es, zh, hi, tl, am, ti)
- [x] Slot machine sound effects (win/lose)
- [x] Match celebration modal
- [x] Bottom tab navigation (Discover, Matches, Profile, Settings)
- [x] Sunset beach background on all screens
- [x] Black & gold theme throughout
- [x] Sugar Baby/Daddy options based on gender
- [x] Weight kg/lbs conversion for female profiles

### Backend API (FastAPI + MongoDB)
- [x] POST /api/auth/register — User registration with bcrypt
- [x] POST /api/auth/login — JWT authentication
- [x] GET /api/auth/me — Get current user
- [x] PUT /api/profile — Update user profile
- [x] GET /api/profiles/discover — Get swipeable profiles
- [x] POST /api/swipe — Record swipe, detect mutual matches
- [x] GET /api/matches — Get user's matches
- [x] GET /api/subscriptions — Get subscription plans
- [x] POST /api/subscribe/{plan_id} — Subscribe to plan

## Architecture
```
/app
├── backend/
│   ├── server.py          # FastAPI with all API routes
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── App.js             # Root: Navigation + Providers
│   ├── app.json           # Expo config (iOS, Android, Web)
│   ├── index.js            # Entry point
│   ├── webpack.config.js
│   ├── src/
│   │   ├── screens/       # All 7 screens (React Native)
│   │   ├── contexts/      # AuthContext, LanguageContext
│   │   ├── translations.js
│   │   ├── mockData.js
│   │   └── constants.js
│   └── package.json
└── memory/PRD.md
```

## Deployment Instructions (For User)
1. Install Expo CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Build for Android: `eas build --platform android`
4. Build for iOS: `eas build --platform ios`
5. Submit to stores: `eas submit --platform android/ios`
- Google Play: $25 one-time developer fee
- Apple App Store: $99/year developer program

## Backlog
### P0 - Critical
- Connect frontend to backend API (replace mock data with real API calls)
- Add real photo upload support

### P1 - Important
- Implement 5-likes-per-day enforcement on backend
- Add real-time chat between matches
- Push notifications
- Confetti celebration on match (native implementation)

### P2 - Nice to Have
- Stripe payment integration for subscriptions
- Location-based matching (GPS + distance radius)
- Profile verification
- Report/block users
