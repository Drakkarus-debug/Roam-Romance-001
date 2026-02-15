# Roam Romance - Product Requirements Document

## Original Problem Statement
Build a Tinder-style dating app named "Roam Romance" with left/right swiping, slot machine sound effects, multi-language support (11 languages), screenshot protection, subscription tiers, and a black & gold theme.

## Core Requirements
- **Swiping**: Left/right swipe with slot machine win/loss sounds
- **Privacy**: Screenshot disabling within the app
- **Monetization**: Free (5 likes/day) + 3 paid tiers (Plus $1.99, Gold $10.99, Platinum $20.99)
- **Localization**: English, French, German, Russian, Arabic, Spanish, Chinese, Hindi, Tagalog, Amharic, Tigrinya
- **Profile**: Gender (M/F), Age (18+), Race, Reason for joining, Pets, Smoke, Passport, Criminal Record
- **Female-specific**: Weight in kg/lbs with auto-conversion
- **Male-specific**: Sugar Daddy option; Female: Sugar Baby option
- **Design**: Black and gold color theme with custom logo

## Tech Stack
- Frontend: React, React Router, Tailwind CSS, shadcn/ui
- State: React Context API (Auth + Language)
- Backend: FastAPI + MongoDB (NOT YET BUILT)

## What's Implemented (Frontend Only - All Mocked)
- [x] Landing page with custom logo and auth forms
- [x] Multi-step profile setup (6 steps: Gender, Age, Race, Details, Interests, Photos)
- [x] Discover/swipe page with drag gestures and action buttons
- [x] Enhanced slot machine sound effects (cascading win tones, descending buzzer for lose)
- [x] Animated match celebration (canvas-confetti gold bursts + floating hearts/stars + pulsing glow)
- [x] Subscription page with 3 tiers fully translated
- [x] Complete 11-language translation system (all pages including subscription)
- [x] Screenshot protection (CSS user-select, print blocking, keyboard shortcut blocking)
- [x] Sugar Baby/Daddy options based on gender
- [x] Criminal record field
- [x] Weight kg/lbs auto-conversion for female profiles
- [x] Education level options fully translated
- [x] Matches, Profile, Settings pages
- [x] 5 likes/day limit for free users
- [x] Black and gold theme throughout

## What's NOT Built Yet
- [ ] Backend API (FastAPI + MongoDB)
- [ ] User authentication (real)
- [ ] Google Social Login
- [ ] Persistent data storage
- [ ] Real matching algorithm
- [ ] Payment processing for subscriptions
- [ ] Location-based matching (up to 300 miles)

## Architecture
```
/app
├── backend/
│   └── server.py         # FastAPI (basic setup only)
├── frontend/
│   ├── src/
│   │   ├── components/   # AppLayout, LanguageSelector, ui/
│   │   ├── contexts/     # AuthContext, LanguageContext
│   │   ├── pages/        # Landing, Discover, Profile, ProfileSetup, Matches, Settings, Subscription
│   │   ├── translations.js  # All 11 language translations
│   │   └── mockData.js   # Mock users, plans, matches
│   └── package.json
└── contracts.md          # API blueprint for backend
```

## Backlog (Prioritized)
### P0 - Critical
- Backend API implementation per contracts.md
- Database models (User, Profile, Match, Subscription)
- Authentication endpoints (email/password + Google)

### P1 - Important
- CRUD endpoints for user profiles
- Swiping/matching backend logic
- 5-likes-per-day enforcement on backend
- Replace all mock data with live API calls

### P2 - Nice to Have
- Subscription payment processing
- Advanced matching algorithms
- Real-time chat between matches
- Push notifications
