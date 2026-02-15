import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMatches } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from '../components/ui/card';
import { MessageCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const Matches = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          {t('matches')}
        </h1>

        {mockMatches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No matches yet. Keep swiping!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {mockMatches.map((match) => (
              <Card
                key={match.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/app/chat/${match.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={match.photo}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {match.unread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{match.name}</h3>
                    <p className={`text-sm truncate ${
                      match.unread ? 'text-yellow-400 font-medium' : 'text-gray-600'
                    }`}>
                      {match.lastMessage}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(match.timestamp)}
                    </span>
                    <MessageCircle className={`w-5 h-5 ${
                      match.unread ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Matches;