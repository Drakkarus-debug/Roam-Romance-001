import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Globe, LogOut } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import LanguageSelector from '../components/LanguageSelector';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t, getCurrentLanguageInfo } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [settings, setSettings] = useState({
    distance: [50],
    ageRange: [18, 35],
    showMe: user?.gender === 'male' ? 'female' : 'male'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 pb-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          {t('settings')}
        </h1>

        {/* Discovery Settings */}
        <Card className="p-6 mb-4 bg-black/90 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Discovery {t('settings')}</h2>
          
          <div className="space-y-6">
            {/* Distance */}
            <div>
              <div className="flex justify-between mb-3">
                <Label>{t('distance')}</Label>
                <span className="text-sm font-medium">{settings.distance[0]} {t('miles')}</span>
              </div>
              <Slider
                value={settings.distance}
                onValueChange={(value) => setSettings({ ...settings, distance: value })}
                max={300}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>300 {t('miles')}</span>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <div className="flex justify-between mb-3">
                <Label>{t('ageRange')}</Label>
                <span className="text-sm font-medium">
                  {settings.ageRange[0]} - {settings.ageRange[1]}
                </span>
              </div>
              <Slider
                value={settings.ageRange}
                onValueChange={(value) => setSettings({ ...settings, ageRange: value })}
                max={100}
                min={18}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>100</span>
              </div>
            </div>

            {/* Show Me */}
            <div>
              <Label className="mb-3 block">{t('showMe')}</Label>
              <RadioGroup
                value={settings.showMe}
                onValueChange={(value) => setSettings({ ...settings, showMe: value })}
                className="space-y-2"
              >
                <Label
                  htmlFor="female"
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    settings.showMe === 'female'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <RadioGroupItem value="female" id="female" className="mr-3" />
                  <span>{t('female')}</span>
                </Label>
                <Label
                  htmlFor="male"
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    settings.showMe === 'male'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <RadioGroupItem value="male" id="male" className="mr-3" />
                  <span>{t('male')}</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Language</h2>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span>{getCurrentLanguageInfo().name}</span>
              </div>
              <span className="text-2xl">{getCurrentLanguageInfo().flag}</span>
            </Button>
            {showLanguageSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
              </div>
            )}
          </div>
        </Card>

        {/* Subscription */}
        <Card className="p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">{t('subscription')}</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {user?.subscription === 'free' ? 'Free Plan' : `Roam ${user?.subscription}`}
              </p>
              {user?.subscription === 'free' && (
                <p className="text-sm text-gray-600">5 likes per day</p>
              )}
            </div>
            <Button
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              onClick={() => navigate('/app/subscription')}
            >
              {user?.subscription === 'free' ? t('upgradeNow') : 'Manage'}
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </Button>
      </div>
    </AppLayout>
  );
};

export default Settings;