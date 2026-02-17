import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, BG_IMAGE } from '../constants';

const STEPS = ['gender', 'age', 'race', 'details', 'interests', 'photos'];

export default function ProfileSetupScreen() {
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ gender: '', age: '', race: '', reason: '', weightKg: '', weightLbs: '', name: '', bio: '', interests: [], drinking: '', smokes: '', exercise: '', education: '', hasPets: '', hasKids: '', criminalRecord: '', photos: [] });

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));
  const toggleInterest = (i) => set('interests', data.interests.includes(i) ? data.interests.filter(x => x !== i) : [...data.interests, i]);

  const pickImage = async () => {
    if (data.photos.length >= 6) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      set('photos', [...data.photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => {
    set('photos', data.photos.filter((_, i) => i !== index));
  };

  const convertKg = (v) => { set('weightKg', v); set('weightLbs', v ? String(Math.round(parseFloat(v) * 2.20462)) : ''); };
  const convertLbs = (v) => { set('weightLbs', v); set('weightKg', v ? String(Math.round(parseFloat(v) / 2.20462)) : ''); };

  const finish = () => updateUser({ ...data, isProfileComplete: true });

  const Chip = ({ label, selected, onPress }) => (
    <TouchableOpacity style={[s.chip, selected && s.chipActive]} onPress={onPress}>
      <Text style={[s.chipText, selected && s.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const reasons = [
    { key: 'marriageMinded' }, { key: 'hookups' }, { key: 'friendship' }, { key: 'networking' },
    ...(data.gender === 'female' ? [{ key: 'sugarbaby' }] : []),
    ...(data.gender === 'male' ? [{ key: 'sugardaddy' }] : []),
  ];

  const interestKeys = ['travel','photography','music','sports','fitness','yoga','cooking','food','wine','coffee','reading','writing','art','movies','dancing','gaming','tech','fashion','hiking','beach','camping','skiing','surfing','pets','dogs','cats','shopping','nature','meditation','volunteering'];

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          {/* Progress */}
          <View style={s.progress}>
            {STEPS.map((_, i) => <View key={i} style={[s.dot, i <= step && s.dotActive]}><Text style={[s.dotText, i <= step && s.dotTextActive]}>{i + 1}</Text></View>)}
          </View>
          <View style={s.bar}><View style={[s.barFill, { width: `${((step + 1) / 6) * 100}%` }]} /></View>

          {/* Step 0: Gender */}
          {step === 0 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('selectGender')}</Text>
              <View style={s.row}>
                <Chip label={t('male')} selected={data.gender === 'male'} onPress={() => set('gender', 'male')} />
                <Chip label={t('female')} selected={data.gender === 'female'} onPress={() => set('gender', 'female')} />
              </View>
            </View>
          )}

          {/* Step 1: Age */}
          {step === 1 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('age')}</Text>
              <TextInput
                style={s.input}
                keyboardType="numeric"
                value={data.age}
                onChangeText={(v) => {
                  const cleaned = v.replace(/[^0-9]/g, '');
                  const num = parseInt(cleaned);
                  if (cleaned === '' || (num >= 0 && num <= 115)) set('age', cleaned);
                }}
                placeholder="18-115"
                placeholderTextColor={COLORS.gray600}
                maxLength={3}
              />
              {data.age !== '' && parseInt(data.age) < 18 && <Text style={s.warn}>{t('mustBe18')}</Text>}
              {data.age !== '' && parseInt(data.age) > 115 && <Text style={s.warn}>Maximum age is 115</Text>}
            </View>
          )}

          {/* Step 2: Race */}
          {step === 2 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('selectRace')}</Text>
              {['white','black','asian','latino','pacificIslander'].map(r => <Chip key={r} label={t(r)} selected={data.race === r} onPress={() => set('race', r)} />)}
            </View>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('details')}</Text>
              {data.gender === 'female' && (
                <View>
                  <Text style={s.label}>{t('weight')}</Text>
                  <View style={s.row}>
                    <TextInput style={[s.input, { flex: 1 }]} keyboardType="numeric" placeholder="Kg" placeholderTextColor={COLORS.gray600} value={data.weightKg} onChangeText={convertKg} />
                    <TextInput style={[s.input, { flex: 1 }]} keyboardType="numeric" placeholder="Lbs" placeholderTextColor={COLORS.gray600} value={data.weightLbs} onChangeText={convertLbs} />
                  </View>
                </View>
              )}
              <Text style={s.label}>{t('selectReason')}</Text>
              {reasons.map(r => <Chip key={r.key} label={t(r.key)} selected={data.reason === r.key} onPress={() => set('reason', r.key)} />)}
            </View>
          )}

          {/* Step 4: Interests & Lifestyle */}
          {step === 4 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('interestsLifestyle')}</Text>
              <Text style={s.label}>{t('selectInterests')}</Text>
              <View style={s.wrap}>{interestKeys.map(i => <Chip key={i} label={t(i)} selected={data.interests.includes(i)} onPress={() => toggleInterest(i)} />)}</View>

              <Text style={s.label}>{t('doYouDrink')}</Text>
              <View style={s.row}>{['never','socially','regularly'].map(v => <Chip key={v} label={t(v)} selected={data.drinking === v} onPress={() => set('drinking', v)} />)}</View>

              <Text style={s.label}>{t('smokes')}</Text>
              <View style={s.row}>{['never','sometimes','regularly'].map(v => <Chip key={v} label={t(v)} selected={data.smokes === v} onPress={() => set('smokes', v)} />)}</View>

              <Text style={s.label}>{t('criminalRecord')}</Text>
              <View style={s.row}>{['no','yes'].map(v => <Chip key={v} label={t(v)} selected={data.criminalRecord === v} onPress={() => set('criminalRecord', v)} />)}</View>

              <Text style={s.label}>{t('exerciseHabits')}</Text>
              <View style={s.row}>{['rarely','sometimes','active'].map(v => <Chip key={v} label={t(v)} selected={data.exercise === v} onPress={() => set('exercise', v)} />)}</View>

              <Text style={s.label}>{t('educationLevel')}</Text>
              <View style={s.wrap}>{['highschool','college','bachelors','masters','phd','tradeschool'].map(v => <Chip key={v} label={t(v)} selected={data.education === v} onPress={() => set('education', v)} />)}</View>

              <Text style={s.label}>{t('hasPets')}</Text>
              <View style={s.row}>{['no','dog','cat','both','other'].map(v => <Chip key={v} label={t(v)} selected={data.hasPets === v} onPress={() => set('hasPets', v)} />)}</View>

              <Text style={s.label}>{t('doYouHaveChildren')}</Text>
              <View style={s.row}>{['no','yes','wantsomeday'].map(v => <Chip key={v} label={t(v)} selected={data.hasKids === v} onPress={() => set('hasKids', v)} />)}</View>
            </View>
          )}

          {/* Step 5: Photos, Name & Bio */}
          {step === 5 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{t('uploadPhotos')}</Text>

              {/* Photo Grid */}
              <Text style={s.label}>{t('myPhotos') || 'My Photos'} ({data.photos.length}/6)</Text>
              <View style={s.photoGrid}>
                {data.photos.map((uri, index) => (
                  <View key={index} style={s.photoWrapper}>
                    <Image source={{ uri }} style={s.photoThumb} />
                    <TouchableOpacity style={s.removePhotoBtn} onPress={() => removePhoto(index)}>
                      <Ionicons name="close-circle" size={24} color={COLORS.red} />
                    </TouchableOpacity>
                  </View>
                ))}
                {data.photos.length < 6 && (
                  <TouchableOpacity style={s.addPhotoBtn} onPress={pickImage}>
                    <Ionicons name="camera-outline" size={32} color={COLORS.gray400} />
                    <Text style={s.addPhotoText}>{t('addPhoto') || 'Add Photo'}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={s.label}>{t('namePlaceholder')}</Text>
              <TextInput style={s.input} value={data.name} onChangeText={(v) => set('name', v)} placeholder={t('namePlaceholder')} placeholderTextColor={COLORS.gray600} />
              <Text style={s.label}>{t('about')}</Text>
              <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]} value={data.bio} onChangeText={(v) => set('bio', v)} placeholder={t('bioPlaceholder')} placeholderTextColor={COLORS.gray600} multiline />
            </View>
          )}

          {/* Navigation */}
          <View style={s.nav}>
            <TouchableOpacity style={s.backBtn} onPress={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
              <Text style={[s.backText, step === 0 && { opacity: 0.3 }]}>{t('back')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.nextBtn} onPress={() => step < 5 ? setStep(step + 1) : finish()}>
              <Text style={s.nextText}>{step < 5 ? t('next') : t('finish')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16, paddingTop: 50 },
  card: { backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' },
  progress: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dot: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.gray700, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: COLORS.gold },
  dotText: { color: COLORS.gray400, fontWeight: 'bold' },
  dotTextActive: { color: '#000' },
  bar: { height: 4, backgroundColor: COLORS.gray700, borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 2 },
  stepContent: { minHeight: 200 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.gold, textAlign: 'center', marginBottom: 16 },
  label: { color: '#fff', fontSize: 14, marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: COLORS.gray900, borderWidth: 1, borderColor: COLORS.gray700, borderRadius: 8, padding: 14, color: '#fff', fontSize: 16, marginBottom: 8 },
  warn: { color: COLORS.gold, fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: COLORS.gray600, marginBottom: 8 },
  chipActive: { borderColor: COLORS.gold, backgroundColor: 'rgba(234,179,8,0.1)' },
  chipText: { color: COLORS.gray300, fontSize: 14 },
  chipTextActive: { color: COLORS.gold },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  backBtn: { borderWidth: 2, borderColor: COLORS.gray600, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  backText: { color: '#fff', fontWeight: '600' },
  nextBtn: { backgroundColor: COLORS.gold, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 },
  nextText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  photoWrapper: { width: 100, height: 130, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  photoThumb: { width: '100%', height: '100%', borderRadius: 12 },
  removePhotoBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12 },
  addPhotoBtn: { width: 100, height: 130, borderRadius: 12, borderWidth: 2, borderColor: COLORS.gray600, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addPhotoText: { color: COLORS.gray400, fontSize: 11, marginTop: 4 },
});
