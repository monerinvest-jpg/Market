import React from 'react';
import { User, Package, Heart, MessageCircle, Gift, Users, Star, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { BuyerProfile } from './BuyerProfile';
import { BuyerOrders } from './BuyerOrders';
import { BuyerFavorites } from './BuyerFavorites';
import { BuyerMessages } from './BuyerMessages';
import { BuyerBonuses } from './BuyerBonuses';
import { BuyerReferral } from './BuyerReferral';

type BuyerPage = 'buyer-profile' | 'buyer-orders' | 'buyer-favorites' | 'buyer-messages' | 'buyer-bonuses' | 'buyer-referral' | 'buyer-reviews';

const menuItems: { page: BuyerPage; label: string; icon: React.ReactNode }[] = [
  { page: 'buyer-profile', label: 'Профиль', icon: <User size={18} /> },
  { page: 'buyer-orders', label: 'Мои заказы', icon: <Package size={18} /> },
  { page: 'buyer-favorites', label: 'Избранное', icon: <Heart size={18} /> },
  { page: 'buyer-messages', label: 'Сообщения', icon: <MessageCircle size={18} /> },
  { page: 'buyer-bonuses', label: 'Бонусы', icon: <Gift size={18} /> },
  { page: 'buyer-referral', label: 'Реферальная программа', icon: <Users size={18} /> },
  { page: 'buyer-reviews', label: 'Мои отзывы', icon: <Star size={18} /> },
];

export const BuyerLayout: React.FC = () => {
  const { currentPage, navigate, user } = useStore();

  const renderContent = () => {
    switch (currentPage as BuyerPage) {
      case 'buyer-profile': return <BuyerProfile />;
      case 'buyer-orders': return <BuyerOrders />;
      case 'buyer-favorites': return <BuyerFavorites />;
      case 'buyer-messages': return <BuyerMessages />;
      case 'buyer-bonuses': return <BuyerBonuses />;
      case 'buyer-referral': return <BuyerReferral />;
      case 'buyer-reviews': return (
        <div className="text-center py-16">
          <Star size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Отзывы появятся после первых покупок</p>
        </div>
      );
      default: return <BuyerProfile />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          {/* User card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                {user?.name.charAt(0)}
              </div>
              <div className="font-bold text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-500 mt-0.5">{user?.email}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1"><MapPin size={12} />{user?.city}</div>
              <div className="mt-3 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold">
                💰 {user?.bonusBalance} бонусов
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="bg-white border border-gray-100 rounded-2xl p-2">
            {menuItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${currentPage === item.page ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className={currentPage === item.page ? 'text-amber-500' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
