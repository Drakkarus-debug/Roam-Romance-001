import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Users, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AppLayout = ({ children }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const navItems = [
    { icon: Heart, label: t('discover'), path: '/app/discover' },
    { icon: Users, label: t('matches'), path: '/app/matches' },
    { icon: MessageCircle, label: t('profile'), path: '/app/profile' },
    { icon: SettingsIcon, label: t('settings'), path: '/app/settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-yellow-400'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-pink-600' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;