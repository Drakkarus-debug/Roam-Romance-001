import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionPlans } from '../mockData';
import { COLORS, BG_IMAGE } from '../constants';

export default function SubscriptionScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();

  const handleSubscribe = (planId) => {
    updateUser({ subscription: planId, likesRemaining: -1 });
    alert(`Subscribed to ${planId}!`);
    navigation.goBack();
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <ScrollView style={s.container} contentContainerStyle={s.scrollContent}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gold} />
        </TouchableOpacity>

        <Text style={s.title}>{t('choosePlan')}</Text>
        <Text style={s.subtitle}>{t('unlockPremium')}</Text>

        {subscriptionPlans.map((plan) => (
          <View key={plan.id} style={[s.card, plan.popular && s.cardPopular]}>
            {plan.popular && <View style={s.popularBadge}><Text style={s.popularText}>{t('popular')}</Text></View>}
            <View style={[s.iconCircle, { backgroundColor: plan.color }]}>
              <Ionicons name="crown" size={28} color="#000" />
            </View>
            <Text style={s.planName}>{t(plan.nameKey)}</Text>
            <View style={s.priceRow}>
              <Text style={s.price}>${plan.price}</Text>
              <Text style={s.perMonth}>{t('perMonth')}</Text>
            </View>

            {plan.features.map((f, i) => (
              <View key={i} style={s.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.gold} />
                <Text style={s.featureText}>{t(f)}</Text>
              </View>
            ))}

            <TouchableOpacity style={[s.subBtn, { backgroundColor: plan.color }]} onPress={() => handleSubscribe(plan.id)} disabled={user?.subscription === plan.id}>
              <Text style={s.subBtnText}>{user?.subscription === plan.id ? t('currentPlan') : t('subscribe')}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={s.freeBtn} onPress={() => navigation.goBack()}>
          <Text style={s.freeBtnText}>{t('continueFreePlan')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { flex: 1, zIndex: 1 },
  scrollContent: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 30, fontWeight: 'bold', color: COLORS.gold, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.gray300, textAlign: 'center', marginBottom: 24 },
  card: { backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardPopular: { borderColor: COLORS.gold, borderWidth: 2 },
  popularBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: COLORS.gold, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  planName: { fontSize: 22, fontWeight: 'bold', color: COLORS.gold, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  price: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  perMonth: { color: COLORS.gray400, fontSize: 14, marginLeft: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  featureText: { color: COLORS.gray300, fontSize: 13, flex: 1 },
  subBtn: { borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 16 },
  subBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  freeBtn: { borderWidth: 1, borderColor: COLORS.gray600, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  freeBtnText: { color: COLORS.gray300, fontSize: 15 },
});
