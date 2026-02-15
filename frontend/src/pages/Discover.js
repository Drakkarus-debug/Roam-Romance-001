import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, X, MapPin, Info, Star, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import AppLayout from '../components/AppLayout';

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

  // Sound effect URLs (we'll use Web Audio API to generate sounds)
  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'win') {
      // Winning slot machine sound - ascending tones
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else {
      // Losing slot machine sound - descending tones
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
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
    // Disable screenshots
    const disableScreenshot = (e) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '3')) {
        e.preventDefault();
        alert('Screenshots are disabled');
      }
    };
    document.addEventListener('keyup', disableScreenshot);
    return () => document.removeEventListener('keyup', disableScreenshot);
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
          <div className="flex justify-between mb-4 text-sm text-gray-500">
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
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
            >
              <Star className="w-8 h-8 text-white" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              onClick={() => handleSwipe('right')}
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Zap className="w-8 h-8 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Match Dialog */}
      <Dialog open={showMatch} onOpenChange={setShowMatch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              {t('itsAMatch')}
            </DialogTitle>
          </DialogHeader>
          {matchedUser && (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center gap-4">
                <img
                  src={matchedUser.photos[0]}
                  alt={matchedUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
                />
              </div>
              <p className="text-lg">You and {matchedUser.name} liked each other!</p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  onClick={() => {
                    setShowMatch(false);
                    navigate('/app/matches');
                  }}
                >
                  {t('sendMessage')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
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