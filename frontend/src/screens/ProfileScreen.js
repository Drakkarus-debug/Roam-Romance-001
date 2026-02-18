import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, BG_IMAGE } from '../constants';
import { nationalFlags } from '../nationalFlags';

export default function ProfileScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const userFlag = nationalFlags.find(f => f.code === user?.nationalFlag);

  const detail = (label, value) => (
    <View style={s.detailRow}><Text style={s.detailLabel}>{label}</Text><Text style={s.detailValue}>{value || 'Not set'}</Text></View>
  );

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <ScrollView style={s.container} contentContainerStyle={s.scrollContent}>
        {/* Upgrade Banner */}
        <TouchableOpacity style={s.banner} onPress={() => navigation.navigate('Subscription')}>
          <Ionicons name="crown" size={22} color={COLORS.gold} />
          <View style={s.bannerText}><Text style={s.bannerTitle}>{t('upgradeToPremium')}</Text></View>
          <View style={s.bannerBtn}><Text style={s.bannerBtnText}>{t('upgradeNow')}</Text></View>
        </TouchableOpacity>

        <View style={s.profileHeader}>
          <Image source={{ uri: user?.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }} style={s.avatar} />
          {userFlag && <View style={s.flagBadge}><Text style={s.flagEmoji}>{userFlag.flag}</Text></View>}
        </View>

        <View style={s.card}>
          <Text style={s.name}>{user?.name || 'User'}, {user?.age || 25}</Text>
          <View style={s.locRow}><Ionicons name="location" size={14} color={COLORS.gray400} /><Text style={s.locText}>{user?.location || t('location') + ' not set'}</Text></View>

          <Text style={s.sectionTitle}>{t('about')}</Text>
          <Text style={s.bioText}>{user?.bio || 'No bio yet'}</Text>

          <Text style={s.sectionTitle}>{t('interests')}</Text>
          <View style={s.tags}>
            {(user?.interests || []).length > 0
              ? user.interests.map((i, idx) => <View key={idx} style={s.tag}><Text style={s.tagText}>{t(i)}</Text></View>)
              : <Text style={s.muted}>No interests selected</Text>
            }
          </View>

          <Text style={s.sectionTitle}>{t('details')}</Text>
          {detail(t('selectGender'), user?.gender ? t(user.gender) : null)}
          {detail(t('race'), user?.race ? t(user.race) : null)}
          {detail(t('reason'), user?.reason ? t(user.reason) : null)}
          {detail(t('doYouDrink'), user?.drinking ? t(user.drinking) : null)}
          {detail(t('smokes'), user?.smokes ? t(user.smokes) : null)}
          {detail(t('criminalRecord'), user?.criminalRecord ? t(user.criminalRecord) : null)}
          {detail(t('hasPets'), user?.hasPets ? t(user.hasPets) : null)}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { flex: 1, zIndex: 1 },
  scrollContent: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 100 },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)', marginBottom: 16 },
  bannerText: { flex: 1, marginLeft: 12 },
  bannerTitle: { color: '#fff', fontWeight: '600' },
  bannerBtn: { backgroundColor: COLORS.gold, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  bannerBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  profileHeader: { alignItems: 'center', marginBottom: 16, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.gold },
  flagBadge: { position: 'absolute', bottom: 0, right: '33%', backgroundColor: '#000', borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.gold },
  flagEmoji: { fontSize: 16 },
  card: { backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(234,179,8,0.15)' },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.gold },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginBottom: 16 },
  locText: { color: COLORS.gray400, fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.gold, marginTop: 16, marginBottom: 8 },
  bioText: { color: COLORS.gray300, fontSize: 14 },
  muted: { color: COLORS.gray600, fontSize: 14 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: COLORS.gold, fontSize: 13 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  detailLabel: { color: COLORS.gray300, fontSize: 14 },
  detailValue: { color: '#fff', fontSize: 14, fontWeight: '500' },
});
