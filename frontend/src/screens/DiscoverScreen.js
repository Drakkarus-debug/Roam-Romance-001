import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Animated, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../mockData';
import { COLORS, BG_IMAGE } from '../constants';
import { getFlagImageUrl } from '../nationalFlags';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

export default function DiscoverScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profiles] = useState([...mockUsers]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchUser, setMatchUser] = useState(null);
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);
  const dragRef = useRef({ startX: 0, startY: 0, dragging: false });

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

  const completeSwipe = useCallback((direction) => {
    const idx = currentIndexRef.current;
    if (idx >= profiles.length) return;
    if (direction === 'right') {
      playSound('win');
      if (Math.random() > 0.7) setMatchUser(profiles[idx]);
    } else {
      playSound('lose');
    }
    const toX = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(posX, { toValue: toX, duration: 250, useNativeDriver: false }).start(() => {
      currentIndexRef.current = idx + 1;
      setCurrentIndex(idx + 1);
      posX.setValue(0);
      posY.setValue(0);
    });
  }, [profiles, playSound, posX, posY]);

  // Gesture handlers that work on both web and native
  const getXY = (e) => {
    if (e.nativeEvent?.touches?.length > 0) {
      return { x: e.nativeEvent.touches[0].pageX, y: e.nativeEvent.touches[0].pageY };
    }
    return { x: e.nativeEvent?.pageX || 0, y: e.nativeEvent?.pageY || 0 };
  };

  const onGestureStart = (e) => {
    const { x, y } = getXY(e);
    dragRef.current = { startX: x, startY: y, dragging: true };
  };

  const onGestureMove = (e) => {
    if (!dragRef.current.dragging) return;
    const { x, y } = getXY(e);
    const dx = x - dragRef.current.startX;
    const dy = y - dragRef.current.startY;
    posX.setValue(dx);
    posY.setValue(dy);
  };

  const onGestureEnd = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const currentDx = posX._value;
    if (currentDx > SWIPE_THRESHOLD) {
      completeSwipe('right');
    } else if (currentDx < -SWIPE_THRESHOLD) {
      completeSwipe('left');
    } else {
      Animated.spring(posX, { toValue: 0, friction: 5, useNativeDriver: false }).start();
      Animated.spring(posY, { toValue: 0, friction: 5, useNativeDriver: false }).start();
    }
  };

  const rotate = posX.interpolate({ inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH], outputRange: ['-12deg', '0deg', '12deg'] });
  const likeOpacity = posX.interpolate({ inputRange: [0, SCREEN_WIDTH / 4], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = posX.interpolate({ inputRange: [-SCREEN_WIDTH / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const currentProfile = profiles[currentIndex];

  // Web-specific event props for the card
  const gestureProps = Platform.OS === 'web' ? {
    onMouseDown: onGestureStart,
    onMouseMove: onGestureMove,
    onMouseUp: onGestureEnd,
    onMouseLeave: onGestureEnd,
    onTouchStart: onGestureStart,
    onTouchMove: onGestureMove,
    onTouchEnd: onGestureEnd,
  } : {
    onTouchStart: onGestureStart,
    onTouchMove: onGestureMove,
    onTouchEnd: onGestureEnd,
  };

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
            <View>
              <Animated.View
                key={currentIndex}
                style={[s.card, { transform: [{ translateX: posX }, { translateY: posY }, { rotate }], cursor: 'grab' }]}
                {...gestureProps}
              >
                <Image source={{ uri: currentProfile.photos[0] }} style={s.photo} resizeMode="contain" />
                <Animated.View style={[s.badge, s.likeBadge, { opacity: likeOpacity }]}>
                  <Text style={s.badgeText}>LIKE</Text>
                </Animated.View>
                <Animated.View style={[s.badge, s.nopeBadge, { opacity: nopeOpacity }]}>
                  <Text style={s.badgeText}>NOPE</Text>
                </Animated.View>
              </Animated.View>
              <View style={s.info}>
                <View style={s.nameRow}>
                  <Text style={s.name}>{currentProfile.name}, {currentProfile.age}</Text>
                  {currentProfile.nationalFlag && (
                    <Image source={{ uri: getFlagImageUrl(currentProfile.nationalFlag, 80) }} style={s.profileFlag} />
                  )}
                </View>
                <Text style={s.distText}>{currentProfile.distance} {t('miles')} {t('away')}</Text>
                <Text style={s.bio} numberOfLines={2}>{currentProfile.bio}</Text>
                <View style={s.tags}>
                  {currentProfile.interests.map((interest, idx) => (
                    <View key={idx} style={s.tag}><Text style={s.tagText}>{interest}</Text></View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>{t('noMoreProfiles')}</Text>
              <Text style={s.emptyText}>{t('changeFilters')}</Text>
            </View>
          )}
        </View>

        <View style={s.actions}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="swipe-left" style={[s.actionBtn, { borderColor: COLORS.red }]} onPress={() => currentProfile && completeSwipe('left')}>
            <Ionicons name="close" size={32} color={COLORS.red} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: COLORS.gold }]} onPress={() => {}}>
            <Ionicons name="star" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="swipe-right" style={[s.actionBtn, { backgroundColor: COLORS.gold }]} onPress={() => currentProfile && completeSwipe('right')}>
            <Ionicons name="heart" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: COLORS.purple }]} onPress={() => {}}>
            <Ionicons name="flash" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

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
  cardArea: { flex: 1, paddingHorizontal: 20, paddingTop: 4, alignItems: 'center' },
  card: { width: '100%', height: 380, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', backgroundColor: '#000', userSelect: 'none' },
  photo: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 30, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 3, zIndex: 10 },
  likeBadge: { right: 20, borderColor: COLORS.green, backgroundColor: 'rgba(34,197,94,0.3)' },
  nopeBadge: { left: 20, borderColor: COLORS.red, backgroundColor: 'rgba(239,68,68,0.3)' },
  badgeText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  info: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#111', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' },
  profileFlag: { width: 30, height: 20, borderRadius: 3 },
  distText: { color: '#aaaaaa', fontSize: 13, marginTop: 2 },
  bio: { color: '#cccccc', fontSize: 13, marginTop: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
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
