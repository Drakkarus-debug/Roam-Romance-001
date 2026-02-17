import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, Modal, FlatList } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { COLORS, BG_IMAGE, LOGO_IMAGE } from '../constants';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLangModal, setShowLangModal] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) return;
    if (!isLogin && password !== confirmPassword) { alert('Passwords do not match'); return; }
    login({ id: '1', email, isProfileComplete: false, subscription: 'free', likesRemaining: 5 });
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Language Button */}
        <TouchableOpacity style={s.langBtn} onPress={() => setShowLangModal(true)}>
          <Ionicons name="globe-outline" size={22} color={COLORS.gold} />
        </TouchableOpacity>

        <View style={s.card}>
          <Image source={{ uri: LOGO_IMAGE }} style={s.logo} resizeMode="contain" />
          <Text style={s.title}>{t('appName')}</Text>
          <Text style={s.subtitle}>{t('welcome')}</Text>

          <TextInput style={s.input} placeholder={t('email')} placeholderTextColor={COLORS.gray600} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.input} placeholder={t('password')} placeholderTextColor={COLORS.gray600} value={password} onChangeText={setPassword} secureTextEntry />
          {!isLogin && <TextInput style={s.input} placeholder={t('confirmPassword')} placeholderTextColor={COLORS.gray600} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />}

          {isLogin && <TouchableOpacity style={s.forgotBtn}><Text style={s.forgotText}>{t('forgotPassword')}</Text></TouchableOpacity>}

          <TouchableOpacity style={s.mainBtn} onPress={handleSubmit}>
            <Text style={s.mainBtnText}>{isLogin ? t('login') : t('createAccount')}</Text>
          </TouchableOpacity>

          <View style={s.divider}><View style={s.dividerLine} /><Text style={s.dividerText}>or</Text><View style={s.dividerLine} /></View>

          <TouchableOpacity style={s.googleBtn} onPress={() => login({ id: '1', email: 'user@gmail.com', isProfileComplete: false, subscription: 'free', likesRemaining: 5 })}>
            <Text style={s.googleText}>{t('continueWithGoogle')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={s.switchBtn}>
            <Text style={s.switchText}>{isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}<Text style={s.switchHighlight}>{isLogin ? t('signup') : t('login')}</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="slide">
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={[s.langItem, item.code === currentLanguage && s.langItemActive]} onPress={() => { changeLanguage(item.code); setShowLangModal(false); }}>
                  <Text style={s.langFlag}>{item.flag}</Text>
                  <Text style={[s.langName, item.code === currentLanguage && s.langNameActive]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  langBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gold },
  card: { backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' },
  logo: { width: 200, height: 200, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: COLORS.gold, marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', color: COLORS.gray300, marginBottom: 20 },
  input: { backgroundColor: COLORS.gray900, borderWidth: 1, borderColor: COLORS.gray700, borderRadius: 8, padding: 14, color: COLORS.white, fontSize: 16, marginBottom: 12 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 12 },
  forgotText: { color: COLORS.gold, fontSize: 13 },
  mainBtn: { backgroundColor: COLORS.gold, borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  mainBtnText: { color: COLORS.black, fontWeight: 'bold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.gray600 },
  dividerText: { marginHorizontal: 12, color: COLORS.gray400 },
  googleBtn: { borderWidth: 1, borderColor: 'rgba(234,179,8,0.5)', borderRadius: 8, padding: 14, alignItems: 'center' },
  googleText: { color: COLORS.gold, fontSize: 15 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: COLORS.gray400, fontSize: 13 },
  switchHighlight: { color: COLORS.gold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { color: COLORS.gold, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, marginBottom: 4 },
  langItemActive: { backgroundColor: 'rgba(234,179,8,0.15)' },
  langFlag: { fontSize: 24, marginRight: 14 },
  langName: { color: COLORS.white, fontSize: 16 },
  langNameActive: { color: COLORS.gold, fontWeight: 'bold' },
});
