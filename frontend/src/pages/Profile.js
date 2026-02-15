import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MapPin, Edit, Crown } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock profile data
  const profile = {
    name: user?.name || 'John Doe',
    age: user?.age || 28,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop'
    ],
    bio: user?.bio || 'Love to travel and explore new places. Coffee enthusiast and adventure seeker.',
    location: user?.location || 'New York, NY',
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
    details: {
      [t('race')]: 'White',
      [t('reason')]: t('marriageMinded'),
      [t('hasPets')]: t('no'),
      [t('smokes')]: t('no'),
      [t('criminalRecord')]: t('no'),
      [t('hasPassport')]: t('yes')
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 pb-8">
        {/* Subscription Banner */}
        {user?.subscription === 'free' && (
          <Card className="mb-6 p-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <div>
                  <p className="font-semibold">{t('upgradeToPremium')}</p>
                  <p className="text-sm opacity-90">Get unlimited likes and more!</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-white text-pink-600 hover:bg-gray-100"
                onClick={() => navigate('/app/subscription')}
              >
                {t('upgradeNow')}
              </Button>
            </div>
          </Card>
        )}

        {/* Profile Header */}
        <div className="relative mb-6">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {profile.photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Profile ${idx + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
          
          <Button
            className="absolute top-2 right-2 bg-white text-gray-800 hover:bg-gray-100"
            size="sm"
            onClick={() => navigate('/app/edit-profile')}
          >
            <Edit className="w-4 h-4 mr-2" />
            {t('editProfile')}
          </Button>
        </div>

        {/* Profile Info */}
        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>
            {user?.subscription !== 'free' && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                <Crown className="w-4 h-4 mr-1" />
                {user?.subscription === 'plus' && 'Plus'}
                {user?.subscription === 'gold' && 'Gold'}
                {user?.subscription === 'platinum' && 'Platinum'}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('about')}</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">{t('interests')}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">{t('details')}</h3>
              <div className="space-y-2">
                {Object.entries(profile.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;