import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Globe, Heart } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const Landing = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Mock login - in real app, this would call backend
    const mockUser = {
      id: '1',
      email,
      isProfileComplete: false,
      subscription: 'free',
      likesRemaining: 5
    };
    
    login(mockUser);
    navigate('/profile-setup');
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    const mockUser = {
      id: '1',
      email: 'user@gmail.com',
      name: 'Google User',
      isProfileComplete: false,
      subscription: 'free',
      likesRemaining: 5
    };
    
    login(mockUser);
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      {/* Language Selector Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className="gap-2 bg-black/80 backdrop-blur-sm hover:bg-black border-yellow-500 text-yellow-500"
        >
          <Globe className="w-4 h-4" />
        </Button>
        {showLanguageSelector && (
          <div className="absolute top-12 right-0">
            <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
          </div>
        )}
      </div>

      <Card className="w-full max-w-md p-8 bg-black/90 backdrop-blur-sm shadow-2xl border border-yellow-500/30">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3 mt-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_roam-dating-1/artifacts/c6dvvshx_ChatGPT%20Image%20Feb%2015%2C%202026%2C%2012_26_39%20PM.png"
              alt="Roam Romance Logo"
              className="w-78 h-78 object-contain"
              style={{ width: '312px', height: '312px' }}
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-1">
            {t('appName')}
          </h1>
          <p className="text-gray-300 mb-4">{t('welcome')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {!isLogin && (
            <div>
              <Input
                type="password"
                placeholder={t('confirmPassword')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-yellow-400 hover:text-yellow-500">
                {t('forgotPassword')}
              </button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/50"
          >
            {isLogin ? t('login') : t('createAccount')}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('continueWithGoogle')}
        </Button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            <span className="text-yellow-400 ml-1">
              {isLogin ? t('signup') : t('login')}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Landing;