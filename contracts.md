# Roam Romance - Frontend & Backend Integration Contracts

## Mock Data Currently Used (frontend/src/mockData.js)
Currently all data is MOCKED in the frontend. The following need to be replaced with real backend API calls:

### 1. User Profiles (mockUsers array)
- **Mock Location**: `/app/frontend/src/mockData.js`
- **Current Usage**: Discover page shows mock profiles for swiping
- **Backend Needed**: GET endpoint to fetch profiles based on filters

### 2. Subscription Plans (subscriptionPlans array)
- **Mock Location**: `/app/frontend/src/mockData.js`
- **Current Usage**: Subscription page displays plans
- **Backend Needed**: Subscription management endpoints

### 3. Matches (mockMatches array)
- **Mock Location**: `/app/frontend/src/mockData.js`
- **Current Usage**: Matches page shows matched users
- **Backend Needed**: Match management endpoints

### 4. User Authentication
- **Mock Location**: Landing.js and ProfileSetup.js
- **Current Usage**: Login/signup stores user in localStorage
- **Backend Needed**: JWT-based auth + Google OAuth integration

## API Contracts

### Authentication APIs

#### POST /api/auth/signup
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "isProfileComplete": false,
    "subscription": "free"
  }
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": { ... }
}
```

#### POST /api/auth/google
**Request:**
```json
{
  "googleToken": "google_oauth_token"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": { ... }
}
```

### Profile APIs

#### POST /api/profile
**Request:**
```json
{
  "gender": "male|female",
  "age": 25,
  "race": "white|black|asian|latino|pacificIslander",
  "reason": "marriageMinded|hookups|friendship|networking",
  "hasPets": "yes|no",
  "smokes": "yes|no",
  "criminalRecord": "yes|no",
  "hasPassport": "yes|no",
  "weight": { "kg": 60, "lbs": 132 },  // Only for females
  "name": "John Doe",
  "bio": "Bio text",
  "location": "New York, NY",
  "photos": ["base64_or_url"]
}
```
**Response:**
```json
{
  "success": true,
  "profile": { ... }
}
```

#### GET /api/profile/:userId
**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "age": 25,
  ...
}
```

#### PUT /api/profile
**Request:** Same as POST /api/profile
**Response:** Updated profile

### Discovery APIs

#### GET /api/discover/profiles
**Query Parameters:**
- distance: number (1-300 miles)
- ageMin: number
- ageMax: number
- gender: string

**Response:**
```json
{
  "profiles": [
    {
      "id": "user_id",
      "name": "Emma",
      "age": 25,
      "photos": ["url"],
      "bio": "text",
      "distance": 5,
      "location": "New York, NY",
      "interests": ["Travel", "Photography"]
    }
  ]
}
```

### Swipe APIs

#### POST /api/swipe
**Request:**
```json
{
  "targetUserId": "user_id",
  "action": "like|nope"
}
```
**Response:**
```json
{
  "match": true|false,
  "matchedUser": { ... }  // If match is true
}
```

#### GET /api/swipe/remaining
**Response:**
```json
{
  "remaining": 5,
  "resetDate": "2025-02-16T00:00:00Z"
}
```

### Match APIs

#### GET /api/matches
**Response:**
```json
{
  "matches": [
    {
      "id": "match_id",
      "user": {
        "id": "user_id",
        "name": "Emma",
        "photo": "url"
      },
      "lastMessage": "Hey!",
      "timestamp": "2025-02-15T10:30:00Z",
      "unread": true
    }
  ]
}
```

### Subscription APIs

#### GET /api/subscription/plans
**Response:**
```json
{
  "plans": [
    {
      "id": "plus|gold|platinum",
      "name": "Roam Plus",
      "price": 1.99,
      "features": ["..."]
    }
  ]
}
```

#### POST /api/subscription/subscribe
**Request:**
```json
{
  "planId": "plus|gold|platinum"
}
```
**Response:**
```json
{
  "success": true,
  "subscription": {
    "plan": "plus",
    "expiresAt": "2025-03-15T00:00:00Z"
  }
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  googleId: String (optional),
  isProfileComplete: Boolean,
  subscription: {
    plan: String, // "free", "plus", "gold", "platinum"
    expiresAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  gender: String,
  age: Number,
  race: String,
  reason: String,
  hasPets: String,
  smokes: String,
  criminalRecord: String,
  hasPassport: String,
  weight: { kg: Number, lbs: Number },
  name: String,
  bio: String,
  location: String,
  photos: [String],
  interests: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Swipes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  targetUserId: ObjectId (ref: Users),
  action: String, // "like", "nope"
  timestamp: Date
}
```

### Matches Collection
```javascript
{
  _id: ObjectId,
  user1Id: ObjectId (ref: Users),
  user2Id: ObjectId (ref: Users),
  createdAt: Date,
  lastMessage: String,
  lastMessageTimestamp: Date
}
```

## Frontend Integration Points

### Files to Update After Backend Implementation

1. **src/pages/Landing.js**
   - Replace mock login/signup with API calls
   - Add JWT token storage

2. **src/pages/ProfileSetup.js**
   - Replace profile creation with POST /api/profile
   - Add photo upload functionality

3. **src/pages/Discover.js**
   - Replace mockUsers with GET /api/discover/profiles
   - Replace handleSwipe with POST /api/swipe
   - Implement real match logic

4. **src/pages/Matches.js**
   - Replace mockMatches with GET /api/matches

5. **src/pages/Subscription.js**
   - Implement real payment processing (MOCKED for MVP)

6. **src/contexts/AuthContext.js**
   - Add JWT token management
   - Implement token refresh logic

## Sound Effects Implementation
Sound effects for swiping are generated using Web Audio API in Discover.js:
- **Win sound** (swipe right): Ascending tone (400Hz → 800Hz)
- **Lose sound** (swipe left): Descending tone (300Hz → 100Hz)

## Screenshot Prevention
Implemented in Discover.js using keyboard event listeners for PrintScreen key.

## Multi-language Support
All translations are hardcoded in `/app/frontend/src/translations.js` for 7 languages:
- English, French, German, Russian, Arabic, Spanish, Chinese

## Free Tier Limitations
- 5 likes per day tracked in localStorage
- Reset at midnight each day
- Enforced in Discover.js before allowing swipes
