import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Upload, X } from 'lucide-react';

const ProfileSetup = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    gender: '',
    age: '',
    race: '',
    reason: '',
    hasPets: '',
    smokes: '',
    criminalRecord: '',
    hasPassport: '',
    weight: { kg: '', lbs: '' },
    name: '',
    bio: '',
    photos: [],
    location: ''
  });

  const races = [
    { value: 'white', label: t('white') },
    { value: 'black', label: t('black') },
    { value: 'asian', label: t('asian') },
    { value: 'latino', label: t('latino') },
    { value: 'pacificIslander', label: t('pacificIslander') }
  ];

  const reasons = [
    { value: 'marriageMinded', label: t('marriageMinded') },
    { value: 'hookups', label: t('hookups') },
    { value: 'friendship', label: t('friendship') },
    { value: 'networking', label: t('networking') }
  ];

  const handleNext = () => {
    if (step === 1 && !profileData.gender) {
      alert(t('selectGender'));
      return;
    }
    if (step === 2 && (!profileData.age || profileData.age < 18)) {
      alert(t('mustBe18'));
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    updateUser({
      ...profileData,
      isProfileComplete: true
    });
    navigate('/app/discover');
  };

  const convertWeight = (value, from) => {
    if (!value) return '';
    if (from === 'kg') {
      return Math.round(value * 2.20462);
    } else {
      return Math.round(value / 2.20462);
    }
  };

  const handleWeightChange = (value, unit) => {
    const numValue = parseFloat(value) || '';
    if (unit === 'kg') {
      setProfileData({
        ...profileData,
        weight: { kg: numValue, lbs: convertWeight(numValue, 'kg') }
      });
    } else {
      setProfileData({
        ...profileData,
        weight: { lbs: numValue, kg: convertWeight(numValue, 'lbs') }
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && profileData.photos.length < 6) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData({
          ...profileData,
          photos: [...profileData.photos, event.target.result]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setProfileData({
      ...profileData,
      photos: profileData.photos.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-black/90 backdrop-blur-sm shadow-2xl border border-yellow-500/30">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/50'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Gender */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('selectGender')}</h2>
            <RadioGroup
              value={profileData.gender}
              onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="male"
                className={`flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  profileData.gender === 'male'
                    ? 'border-yellow-400 bg-yellow-500/10'
                    : 'border-gray-600 hover:border-yellow-500/50'
                }`}
              >
                <RadioGroupItem value="male" id="male" className="sr-only" />
                <span className="text-xl font-semibold text-gray-200">{t('male')}</span>
              </Label>
              <Label
                htmlFor="female"
                className={`flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  profileData.gender === 'female'
                    ? 'border-yellow-400 bg-yellow-500/10'
                    : 'border-gray-600 hover:border-yellow-500/50'
                }`}
              >
                <RadioGroupItem value="female" id="female" className="sr-only" />
                <span className="text-xl font-semibold text-gray-200">{t('female')}</span>
              </Label>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('age')}</h2>
            <div>
              <Label className="text-white">{t('age')}</Label>
              <Input
                type="number"
                min="18"
                max="100"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                className="text-lg bg-gray-900 border-gray-700 text-white"
              />
              {profileData.age && profileData.age < 18 && (
                <p className="text-yellow-400 text-sm mt-2">{t('mustBe18')}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Race */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('selectRace')}</h2>
            <RadioGroup
              value={profileData.race}
              onValueChange={(value) => setProfileData({ ...profileData, race: value })}
              className="space-y-3"
            >
              {races.map((race) => (
                <Label
                  key={race.value}
                  htmlFor={race.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    profileData.race === race.value
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : 'border-gray-200 hover:border-yellow-500/50'
                  }`}
                >
                  <RadioGroupItem value={race.value} id={race.value} className="mr-3" />
                  <span className="text-lg text-gray-200">{race.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Additional Info */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('details')}</h2>
            
            {/* Weight (for females only) */}
            {profileData.gender === 'female' && (
              <div>
                <Label className="text-white">{t('weight')}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Kg"
                      value={profileData.weight.kg}
                      onChange={(e) => handleWeightChange(e.target.value, 'kg')}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Lbs"
                      value={profileData.weight.lbs}
                      onChange={(e) => handleWeightChange(e.target.value, 'lbs')}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <Label className="text-white">{t('selectReason')}</Label>
              <RadioGroup
                value={profileData.reason}
                onValueChange={(value) => setProfileData({ ...profileData, reason: value })}
                className="space-y-2"
              >
                {reasons.map((reason) => (
                  <Label
                    key={reason.value}
                    htmlFor={reason.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      profileData.reason === reason.value
                        ? 'border-yellow-400 bg-yellow-500/10'
                        : 'border-gray-200 hover:border-yellow-500/50'
                    }`}
                  >
                    <RadioGroupItem value={reason.value} id={reason.value} className="mr-3" />
                    <span>{reason.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 5: Yes/No Questions */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('details')}</h2>
            
            {[
              { key: 'hasPets', label: t('hasPets') },
              { key: 'smokes', label: t('smokes') },
              { key: 'criminalRecord', label: t('criminalRecord') },
              { key: 'hasPassport', label: t('hasPassport') }
            ].map((question) => (
              <div key={question.key}>
                <Label className="mb-3 block">{question.label}</Label>
                <RadioGroup
                  value={profileData[question.key]}
                  onValueChange={(value) => setProfileData({ ...profileData, [question.key]: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor={`${question.key}-yes`}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      profileData[question.key] === 'yes'
                        ? 'border-yellow-400 bg-yellow-500/10'
                        : 'border-gray-200 hover:border-yellow-500/50'
                    }`}
                  >
                    <RadioGroupItem value="yes" id={`${question.key}-yes`} className="sr-only" />
                    <span className="font-semibold">{t('yes')}</span>
                  </Label>
                  <Label
                    htmlFor={`${question.key}-no`}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      profileData[question.key] === 'no'
                        ? 'border-yellow-400 bg-yellow-500/10'
                        : 'border-gray-200 hover:border-yellow-500/50'
                    }`}
                  >
                    <RadioGroupItem value="no" id={`${question.key}-no`} className="sr-only" />
                    <span className="font-semibold">{t('no')}</span>
                  </Label>
                </RadioGroup>
              </div>
            ))}
          </div>
        )}

        {/* Step 6: Photos & Bio */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400">{t('uploadPhotos')}</h2>
            
            <div>
              <Label>{t('namePlaceholder')}</Label>
              <Input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <Label>{t('location')}</Label>
              <Input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                placeholder="City, State"
              />
            </div>

            <div>
              <Label>{t('about')}</Label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder={t('bioPlaceholder')}
                className="w-full p-3 border rounded-lg resize-none h-24"
              />
            </div>

            <div>
              <Label>{t('myPhotos')} ({profileData.photos.length}/6)</Label>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {profileData.photos.length < 6 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400" />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={step === 1}
          >
            {t('back')}
          </Button>
          
          {step < 6 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-pink-600 hover:to-rose-700"
            >
              {t('next')}
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-pink-600 hover:to-rose-700"
            >
              {t('finish')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetup;