import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, BG_IMAGE } from '../constants';
import { nationalFlags } from '../nationalFlags';

export default function SettingsScreen({ navigation }) {
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const { user, updateUser, logout } = useAuth();
  const [distance, setDistance] = useState(50);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagSearch, setFlagSearch] = useState('');
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];
  const isPaid = user?.subscription && user.subscription !== 'free';
  const selectedFlag = nationalFlags.find(f => f.code === user?.nationalFlag);
  const filteredFlags = flagSearch ? nationalFlags.filter(f => f.name.toLowerCase().includes(flagSearch.toLowerCase())) : nationalFlags;

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <ScrollView style={s.container} contentContainerStyle={s.scrollContent}>
        <Text style={s.title}>{t('settings')}</Text>

        {/* Discovery Settings */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('discover')} {t('settings')}</Text>
          <View style={s.row}><Text style={s.label}>{t('distance')}</Text><Text style={s.value}>{distance} {t('miles')}</Text></View>
          <View style={s.row}><Text style={s.label}>{t('ageRange')}</Text><Text style={s.value}>18 - 35</Text></View>
          <View style={s.row}><Text style={s.label}>{t('showMe')}</Text><Text style={s.value}>{t('female')}</Text></View>
        </View>

        {/* Language */}
        <TouchableOpacity style={s.card} onPress={() => setShowLangModal(true)}>
          <Text style={s.cardTitle}>{t('settings')}</Text>
          <View style={s.langRow}>
            <Ionicons name="globe-outline" size={20} color={COLORS.gold} />
            <Text style={s.langText}>{currentLang.name}</Text>
            <Text style={s.langFlag}>{currentLang.flag}</Text>
          </View>
        </TouchableOpacity>

        {/* National Flag (Paid feature) */}
        <TouchableOpacity style={s.card} onPress={() => isPaid ? setShowFlagModal(true) : navigation.navigate('Subscription')}>
          <Text style={s.cardTitle}>National Flag {!isPaid && <Text style={s.premiumBadge}> Premium</Text>}</Text>
          {isPaid ? (
            <View style={s.langRow}>
              <Ionicons name="flag-outline" size={20} color={COLORS.gold} />
              <Text style={s.langText}>{selectedFlag ? selectedFlag.name : 'Select your flag'}</Text>
              <Text style={s.langFlag}>{selectedFlag ? selectedFlag.flag : '🏳️'}</Text>
            </View>
          ) : (
            <View style={s.langRow}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray600} />
              <Text style={[s.langText, { color: COLORS.gray600 }]}>Upgrade to add your national flag</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Subscription */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('subscription')}</Text>
          <View style={s.subRow}>
            <View><Text style={s.subPlan}>Free Plan</Text><Text style={s.subDetail}>5 {t('likesRemaining').toLowerCase()}</Text></View>
            <TouchableOpacity style={s.upgradeBtn} onPress={() => navigation.navigate('Subscription')}>
              <Text style={s.upgradeBtnText}>{t('upgradeNow')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={s.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="slide">
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Language</Text>
            <FlatList data={languages} keyExtractor={i => i.code} renderItem={({ item }) => (
              <TouchableOpacity style={[s.langItem, item.code === currentLanguage && s.langItemActive]} onPress={() => { changeLanguage(item.code); setShowLangModal(false); }}>
                <Text style={s.langItemFlag}>{item.flag}</Text>
                <Text style={[s.langItemName, item.code === currentLanguage && { color: COLORS.gold }]}>{item.name}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { flex: 1, zIndex: 1 },
  scrollContent: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.gold, marginBottom: 20 },
  card: { backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(234,179,8,0.15)' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.gold, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  label: { color: COLORS.gray300, fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '500' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langText: { color: '#fff', fontSize: 15, flex: 1 },
  langFlag: { fontSize: 22 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subPlan: { color: '#fff', fontSize: 15, fontWeight: '600' },
  subDetail: { color: COLORS.gray400, fontSize: 13, marginTop: 2 },
  upgradeBtn: { backgroundColor: COLORS.gold, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  upgradeBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, padding: 16, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  logoutText: { color: COLORS.red, fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { color: COLORS.gold, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, marginBottom: 4 },
  langItemActive: { backgroundColor: 'rgba(234,179,8,0.15)' },
  langItemFlag: { fontSize: 24, marginRight: 14 },
  langItemName: { color: '#fff', fontSize: 16 },
});
