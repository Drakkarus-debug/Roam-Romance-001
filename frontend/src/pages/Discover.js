import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, X, MapPin, Info, Star, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import AppLayout from '../components/AppLayout';
import confetti from 'canvas-confetti';

const Discover = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([...mockUsers]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (type === 'win') {
      // Slot machine winning sound - cascading coin tones
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.15);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.15);
      });
      // Final shimmer
      const shimmer = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioContext.destination);
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(1200, audioContext.currentTime + 0.4);
      shimmer.frequency.exponentialRampToValueAtTime(2400, audioContext.currentTime + 0.7);
      shimmerGain.gain.setValueAtTime(0.1, audioContext.currentTime + 0.4);
      shimmerGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      shimmer.start(audioContext.currentTime + 0.4);
      shimmer.stop(audioContext.currentTime + 0.8);
    } else {
      // Slot machine losing sound - descending "wah wah" buzzer
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.6);
      gain.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.7);
      // Second lower tone
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(200, audioContext.currentTime + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.7);
      gain2.gain.setValueAtTime(0.1, audioContext.currentTime + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      osc2.start(audioContext.currentTime + 0.3);
      osc2.stop(audioContext.currentTime + 0.8);
    }
  };

  const checkLikesRemaining = () => {
    const today = new Date().toDateString();
    const lastSwipeDate = localStorage.getItem('roam_last_swipe_date');
    let swipesToday = parseInt(localStorage.getItem('roam_swipes_today') || '0');

    if (lastSwipeDate !== today) {
      swipesToday = 0;
      localStorage.setItem('roam_last_swipe_date', today);
      localStorage.setItem('roam_swipes_today', '0');
    }

    if (user.subscription === 'free' && swipesToday >= 5) {
      return false;
    }
    return true;
  };

  const incrementSwipes = () => {
    const swipesToday = parseInt(localStorage.getItem('roam_swipes_today') || '0');
    localStorage.setItem('roam_swipes_today', (swipesToday + 1).toString());
  };

  const fireMatchCelebration = useCallback(() => {
    const gold = ['#FFD700', '#FFA500', '#FFEC8B', '#DAA520', '#F0E68C'];
    // Burst from left
    confetti({ particleCount: 80, spread: 70, origin: { x: 0.1, y: 0.6 }, colors: gold, angle: 60 });
    // Burst from right
    confetti({ particleCount: 80, spread: 70, origin: { x: 0.9, y: 0.6 }, colors: gold, angle: 120 });
    // Center shower after short delay
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.3 }, colors: [...gold, '#FF69B4', '#FF1493'], gravity: 0.8, scalar: 1.2 });
    }, 300);
    // Final sparkle
    setTimeout(() => {
      confetti({ particleCount: 40, spread: 160, origin: { x: 0.5, y: 0.5 }, colors: gold, ticks: 80, shapes: ['circle'], scalar: 0.6 });
    }, 700);
  }, []);

  const handleSwipe = (direction) => {
    if (!checkLikesRemaining()) {
      alert(t('upgradeNow'));
      navigate('/app/subscription');
      return;
    }

    setSwipeDirection(direction);

    if (direction === 'right') {
      playSound('win');
      // Simulate match (20% chance)
      if (Math.random() > 0.8) {
        setMatchedUser(profiles[currentIndex]);
        setShowMatch(true);
        fireMatchCelebration();
      }
      incrementSwipes();
    } else {
      playSound('lose');
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const offsetX = e.clientX - dragStart.x;
    const offsetY = e.clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const offsetX = e.touches[0].clientX - dragStart.x;
    const offsetY = e.touches[0].clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    // Disable screenshots - keyboard shortcuts
    const disableScreenshot = (e) => {
      if (e.key === 'PrintScreen' || 
          (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
          (e.ctrlKey && e.key === 'p') ||
          (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };
    // Disable right-click context menu
    const disableContextMenu = (e) => e.preventDefault();
    
    document.addEventListener('keydown', disableScreenshot);
    document.addEventListener('keyup', disableScreenshot);
    document.addEventListener('contextmenu', disableContextMenu);
    return () => {
      document.removeEventListener('keydown', disableScreenshot);
      document.removeEventListener('keyup', disableScreenshot);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('noMoreProfiles')}</h2>
            <p className="text-gray-600 mb-6">{t('changeFilters')}</p>
            <Button onClick={() => navigate('/app/settings')}>
              {t('settings')}
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const rotation = dragOffset.x / 20;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <AppLayout>
      <div className="flex items-center justify-center h-full px-4 py-8">
        <div className="w-full max-w-md relative">
          {/* Swipe Hints */}
          <div className="flex justify-between mb-4 text-sm text-gray-400">
            <span>{t('swipeLeft')}</span>
            <span>{t('swipeRight')}</span>
          </div>

          {/* Profile Card */}
          <div className="relative h-[600px]">
            <Card
              ref={cardRef}
              className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl transition-transform"
              style={{
                transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
                opacity: opacity,
                transition: isDragging ? 'none' : 'transform 0.3s, opacity 0.3s'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Photo */}
              <div className="relative h-full">
                <img
                  src={currentProfile.photos[0]}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Swipe Indicators */}
                {dragOffset.x > 50 && (
                  <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full text-2xl font-bold transform rotate-12">
                    LIKE
                  </div>
                )}
                {dragOffset.x < -50 && (
                  <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold transform -rotate-12">
                    NOPE
                  </div>
                )}

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-3xl font-bold">
                        {currentProfile.name}, {currentProfile.age}
                      </h2>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{currentProfile.distance} {t('miles')} {t('away')}</span>
                      </div>
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <p className="text-sm mb-3">{currentProfile.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full p-0 border-2 border-red-500 hover:bg-red-50"
              onClick={() => handleSwipe('left')}
            >
              <X className="w-8 h-8 text-red-500" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-amber-600"
            >
              <Star className="w-8 h-8 text-white" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-600 hover:from-pink-600 hover:to-rose-700"
              onClick={() => handleSwipe('right')}
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-purple-600 hover:to-indigo-700"
            >
              <Zap className="w-8 h-8 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Match Dialog */}
      <Dialog open={showMatch} onOpenChange={setShowMatch}>
        <DialogContent className="max-w-md bg-black border border-yellow-500/50 overflow-hidden" data-testid="match-dialog">
          {/* Floating particles background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-yellow-400 opacity-0"
                style={{
                  left: `${8 + Math.random() * 84}%`,
                  bottom: '-20px',
                  fontSize: `${14 + Math.random() * 18}px`,
                  animation: `floatUp ${2.5 + Math.random() * 2}s ease-out ${i * 0.2}s forwards`
                }}
              >
                {['♥', '✦', '★', '♥'][i % 4]}
              </span>
            ))}
          </div>
          <style>{`
            @keyframes floatUp {
              0% { transform: translateY(0) scale(0.5); opacity: 0; }
              20% { opacity: 0.9; }
              100% { transform: translateY(-350px) scale(1.1) rotate(${Math.random() > 0.5 ? '' : '-'}20deg); opacity: 0; }
            }
            @keyframes pulseGlow {
              0%, 100% { box-shadow: 0 0 15px rgba(234,179,8,0.4), 0 0 30px rgba(234,179,8,0.1); }
              50% { box-shadow: 0 0 25px rgba(234,179,8,0.7), 0 0 50px rgba(234,179,8,0.3); }
            }
            @keyframes scaleIn {
              0% { transform: scale(0.3); opacity: 0; }
              60% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <DialogHeader>
            <DialogTitle
              className="text-center text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent"
              style={{ animation: 'scaleIn 0.5s ease-out' }}
            >
              {t('itsAMatch')}
            </DialogTitle>
          </DialogHeader>
          {matchedUser && (
            <div className="text-center space-y-4 py-4 relative z-10">
              <div className="flex justify-center gap-4" style={{ animation: 'scaleIn 0.6s ease-out 0.15s both' }}>
                <img
                  src={matchedUser.photos[0]}
                  alt={matchedUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
                  style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                />
              </div>
              <p className="text-lg text-gray-200">You and {matchedUser.name} liked each other!</p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-600 hover:from-amber-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/50"
                  onClick={() => {
                    setShowMatch(false);
                    navigate('/app/matches');
                  }}
                >
                  {t('sendMessage')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowMatch(false)}
                >
                  {t('keepSwiping')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Discover;