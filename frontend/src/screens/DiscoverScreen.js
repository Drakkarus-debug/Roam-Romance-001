import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Animated, PanResponder, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../mockData';
import { COLORS, BG_IMAGE } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;

export default function DiscoverScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profiles] = useState([...mockUsers]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchUser, setMatchUser] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;
  const currentIndexRef = useRef(0);

  const playSound = useCallback((type) => {
    if (Platform.OS === 'web') {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === 'win') {
          [523, 659, 784, 1047].forEach((freq, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination); o.type = 'square';
            o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.12);
            o.start(ctx.currentTime + i * 0.1); o.stop(ctx.currentTime + i * 0.1 + 0.12);
          });
        } else {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination); o.type = 'sawtooth';
          o.frequency.setValueAtTime(400, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);
          g.gain.setValueAtTime(0.12, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.6);
        }
      } catch (e) {}
    }
  }, []);

  const advanceCard = useCallback((direction) => {
    const idx = currentIndexRef.current;
    if (idx >= profiles.length) return;

    if (direction === 'right') {
      playSound('win');
      if (Math.random() > 0.7) {
        setMatchUser(profiles[idx]);
      }
    } else {
      playSound('lose');
    }

    const toX = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, { toValue: { x: toX, y: 0 }, duration: 250, useNativeDriver: false }).start(() => {
      currentIndexRef.current = idx + 1;
      setCurrentIndex(idx + 1);
      position.setValue({ x: 0, y: 0 });
    });
  }, [profiles, playSound, position]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderGrant: () => {
        position.setOffset({ x: position.x._value, y: position.y._value });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        position.flattenOffset();
        if (gesture.dx > SWIPE_THRESHOLD) {
          const idx = currentIndexRef.current;
          if (idx < profiles.length) {
            playSound('win');
            if (Math.random() > 0.7) setMatchUser(profiles[idx]);
          }
          Animated.timing(position, { toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy }, duration: 200, useNativeDriver: false }).start(() => {
            currentIndexRef.current += 1;
            setCurrentIndex(currentIndexRef.current);
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          const idx = currentIndexRef.current;
          if (idx < profiles.length) playSound('lose');
          Animated.timing(position, { toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy }, duration: 200, useNativeDriver: false }).start(() => {
            currentIndexRef.current += 1;
            setCurrentIndex(currentIndexRef.current);
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({ inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH], outputRange: ['-12deg', '0deg', '12deg'] });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SCREEN_WIDTH / 4], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SCREEN_WIDTH / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const currentProfile = profiles[currentIndex];

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={s.bg} resizeMode="cover">
      <View style={s.overlay} />
      <View style={s.container}>
        <View style={s.hints}>
          <Text style={s.hintText}>{t('swipeLeft')}</Text>
          <Text style={s.hintText}>{t('swipeRight')}</Text>
        </View>

        <View style={s.cardArea}>
          {currentProfile ? (
            <Animated.View
              key={currentIndex}
              style={[s.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}
              {...panResponder.panHandlers}
            >
              <Image source={{ uri: currentProfile.photos[0] }} style={s.photo} />
              <View style={s.gradient}>
                <Animated.View style={[s.badge, s.likeBadge, { opacity: likeOpacity }]}>
                  <Text style={s.badgeText}>LIKE</Text>
                </Animated.View>
                <Animated.View style={[s.badge, s.nopeBadge, { opacity: nopeOpacity }]}>
                  <Text style={s.badgeText}>NOPE</Text>
                </Animated.View>
                <View style={s.info}>
                  <Text style={s.name}>{currentProfile.name}, {currentProfile.age}</Text>
                  <View style={s.distRow}>
                    <Ionicons name="location" size={14} color="#fff" />
                    <Text style={s.distText}>{currentProfile.distance} {t('miles')} {t('away')}</Text>
                  </View>
                  <Text style={s.bio}>{currentProfile.bio}</Text>
                  <View style={s.tags}>
                    {currentProfile.interests.map((interest, idx) => (
                      <View key={idx} style={s.tag}><Text style={s.tagText}>{interest}</Text></View>
                    ))}
                  </View>
                </View>
              </View>
            </Animated.View>
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>{t('noMoreProfiles')}</Text>
              <Text style={s.emptyText}>{t('changeFilters')}</Text>
            </View>
          )}
        </View>

        <View style={s.actions}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="swipe-left" style={[s.actionBtn, { borderColor: COLORS.red }]} onPress={() => currentProfile && advanceCard('left')}>
            <Ionicons name="close" size={32} color={COLORS.red} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: COLORS.gold }]} onPress={() => {}}>
            <Ionicons name="star" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="swipe-right" style={[s.actionBtn, { backgroundColor: COLORS.gold }]} onPress={() => currentProfile && advanceCard('right')}>
            <Ionicons name="heart" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: COLORS.purple }]} onPress={() => {}}>
            <Ionicons name="flash" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Match Modal */}
      {matchUser && (
        <View style={s.matchOverlay}>
          <View style={s.matchCard}>
            <Text style={s.matchTitle}>{t('itsAMatch')}</Text>
            <Image source={{ uri: matchUser.photos[0] }} style={s.matchPhoto} />
            <Text style={s.matchName}>You and {matchUser.name} liked each other!</Text>
            <TouchableOpacity style={s.matchBtn} onPress={() => setMatchUser(null)}>
              <Text style={s.matchBtnText}>{t('sendMessage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMatchUser(null)}>
              <Text style={s.matchKeep}>{t('keepSwiping')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  container: { flex: 1, paddingTop: 50, zIndex: 1 },
  hints: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  hintText: { color: COLORS.gray400, fontSize: 12 },
  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: SCREEN_WIDTH - 40, height: 520, borderRadius: 16, overflow: 'hidden', backgroundColor: '#222' },
  photo: { width: '100%', height: '65%', position: 'absolute', top: 0 },
  gradient: { flex: 1, justifyContent: 'flex-end' },
  badge: { position: 'absolute', top: 40, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 3 },
  likeBadge: { right: 20, borderColor: COLORS.green, backgroundColor: 'rgba(34,197,94,0.3)' },
  nopeBadge: { left: 20, borderColor: COLORS.red, backgroundColor: 'rgba(239,68,68,0.3)' },
  badgeText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  info: { padding: 16, backgroundColor: 'rgba(0,0,0,0.85)', minHeight: 140 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  distText: { color: '#ddd', fontSize: 13 },
  bio: { color: '#ccc', fontSize: 14, marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 12 },
  empty: { alignItems: 'center', padding: 40 },
  emptyTitle: { color: COLORS.gold, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { color: COLORS.gray400, fontSize: 14, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 16 },
  actionBtn: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  matchOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  matchCard: { backgroundColor: '#111', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold, width: '85%' },
  matchTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.gold, marginBottom: 20 },
  matchPhoto: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: COLORS.gold, marginBottom: 16 },
  matchName: { color: COLORS.gray300, fontSize: 16, textAlign: 'center', marginBottom: 20 },
  matchBtn: { backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12 },
  matchBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  matchKeep: { color: COLORS.gray400, fontSize: 14 },
});
