import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionPlans } from '../mockData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Crown } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const Subscription = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (planId) => {
    // Mock subscription - in real app, this would process payment
    updateUser({ subscription: planId, likesRemaining: -1 });
    alert(`Successfully subscribed to Roam ${planId}!`);
    navigate('/app/discover');
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {t('choosePlan')}
          </h1>
          <p className="text-gray-300">Unlock premium features and find your perfect match</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 relative overflow-hidden transition-all hover:shadow-xl bg-black/90 ${
                plan.popular ? 'border-2 border-yellow-500 scale-105' : 'border border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${plan.color} text-white text-sm font-bold rounded-full`}>
                  {t('popular')}
                </div>
              )}

              <div className="mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">{t('perMonth')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={user?.subscription === plan.id}
              >
                {user?.subscription === plan.id ? 'Current Plan' : t('subscribe')}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/app/discover')}
          >
            Continue with Free Plan
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Subscription;