// Mock data for Roam Romance dating app

export const mockUsers = [
  {
    id: '1',
    name: 'Emma Johnson',
    age: 25,
    gender: 'female',
    race: 'White',
    reason: 'Marriage Minded',
    hasPets: true,
    smokes: false,
    criminalRecord: false,
    hasPassport: true,
    weight: { kg: 58, lbs: 128 },
    bio: 'Love traveling and photography. Looking for someone to explore the world with!',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop'],
    distance: 5,
    location: 'New York, NY',
    interests: ['Travel', 'Photography', 'Yoga']
  },
  {
    id: '2',
    name: 'Sophie Martin',
    age: 27,
    gender: 'female',
    race: 'Asian',
    reason: 'Friendship',
    hasPets: false,
    smokes: false,
    criminalRecord: false,
    hasPassport: true,
    weight: { kg: 52, lbs: 115 },
    bio: 'Foodie and book lover. Coffee dates are my favorite!',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop'],
    distance: 12,
    location: 'Brooklyn, NY',
    interests: ['Reading', 'Cooking', 'Coffee']
  },
  {
    id: '3',
    name: 'Isabella Rodriguez',
    age: 24,
    gender: 'female',
    race: 'Latino',
    reason: 'Hook-Ups',
    hasPets: true,
    smokes: false,
    criminalRecord: false,
    hasPassport: false,
    weight: { kg: 62, lbs: 137 },
    bio: 'Dance instructor by day, adventure seeker by night. Let\'s have fun!',
    photos: ['https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=500&h=600&fit=crop'],
    distance: 8,
    location: 'Manhattan, NY',
    interests: ['Dancing', 'Fitness', 'Music']
  },
  {
    id: '4',
    name: 'Aisha Patel',
    age: 29,
    gender: 'female',
    race: 'Asian',
    reason: 'Marriage Minded',
    hasPets: false,
    smokes: false,
    criminalRecord: false,
    hasPassport: true,
    weight: { kg: 55, lbs: 121 },
    bio: 'Software engineer who loves hiking and trying new restaurants.',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop'],
    distance: 15,
    location: 'Queens, NY',
    interests: ['Hiking', 'Tech', 'Food']
  },
  {
    id: '5',
    name: 'Emily Chen',
    age: 26,
    gender: 'female',
    race: 'Asian',
    reason: 'Networking',
    hasPets: true,
    smokes: false,
    criminalRecord: false,
    hasPassport: true,
    weight: { kg: 50, lbs: 110 },
    bio: 'Entrepreneur looking to meet interesting people and expand my network.',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop'],
    distance: 20,
    location: 'Jersey City, NJ',
    interests: ['Business', 'Networking', 'Art']
  }
];

export const subscriptionPlans = [
  {
    id: 'plus',
    name: 'roamPlus',
    price: 1.99,
    color: 'from-pink-500 to-rose-500',
    features: [
      'feature1',
      'feature2',
      'feature3',
      'feature4',
      'feature5',
      'feature6',
      'feature7'
    ]
  },
  {
    id: 'gold',
    name: 'roamGold',
    price: 10.99,
    color: 'from-yellow-400 to-amber-500',
    features: [
      'feature8',
      'feature9',
      'feature10',
      'feature11',
      'feature12',
      'feature13'
    ],
    popular: true
  },
  {
    id: 'platinum',
    name: 'roamPlatinum',
    price: 20.99,
    color: 'from-purple-500 to-indigo-500',
    features: [
      'feature14',
      'feature15',
      'feature16',
      'feature17',
      'feature18',
      'feature19'
    ]
  }
];

export const mockMatches = [
  {
    id: '1',
    name: 'Emma Johnson',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop',
    lastMessage: 'Hey! How are you?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unread: true
  },
  {
    id: '3',
    name: 'Isabella Rodriguez',
    photo: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=500&h=600&fit=crop',
    lastMessage: 'Would love to meet up!',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    unread: false
  }
];

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' }
];