import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Check } from 'lucide-react';

const LanguageSelector = ({ onClose }) => {
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();

  return (
    <Card className="p-4 w-64 max-h-96 overflow-y-auto bg-black shadow-xl border border-yellow-500/30">
      <div className="space-y-2">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              changeLanguage(lang.code);
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              currentLanguage === lang.code
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default LanguageSelector;