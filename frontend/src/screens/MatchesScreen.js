import React from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { mockMatches } from '../mockData';
import { COLORS, BG_IMAGE } from '../constants';

export default function MatchesScreen() {
  const { t } = useLanguage();

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.title}>{t('matches')}</Text>
          <TouchableOpacity style={s.upgradeBtn} onPress={() => navigation?.navigate?.('Subscription')}>
            <Text style={s.upgradeBtnText}>{t('upgradeNow')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.matchItem}>
              <Image source={{ uri: item.photo }} style={s.avatar} />
              <View style={s.matchInfo}>
                <Text style={s.matchName}>{item.name}</Text>
                <Text style={s.matchMsg} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              {item.unread && <View style={s.unreadDot} />}
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray600} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={s.empty}><Ionicons name="heart-outline" size={60} color={COLORS.gray600} /><Text style={s.emptyText}>{t('noMoreProfiles')}</Text></View>}
        />
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, zIndex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.gold, marginBottom: 20 },
  matchItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(234,179,8,0.15)' },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: COLORS.gold },
  matchInfo: { flex: 1, marginLeft: 14 },
  matchName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  matchMsg: { color: COLORS.gray400, fontSize: 13, marginTop: 2 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.gold, marginRight: 8 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: COLORS.gray400, fontSize: 16, marginTop: 12 },
});
