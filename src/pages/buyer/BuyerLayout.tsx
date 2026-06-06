import React from 'react';
import { useStore, Page } from '../../store/useStore';
import { User, Package, Heart, Gift, Star } from 'lucide-react';
import { BuyerProfile } from './BuyerProfile';
import { BuyerOrders } from './BuyerOrders';
import { BuyerFavorites } from './BuyerFavorites';

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'buyer-profile', label: 'Профиль', icon: User },
  { page: 'buyer-orders', label: 'Мои заказы', icon: Package },
  { page: 'buyer-favorites', label: 'Избранное', icon: Heart },
  { page: 'buyer-bonuses', label: 'Бонусы', icon: Gift },
];

const BuyerBonuses: React.FC = () => {
  const { user } = useStore();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Бонусный счёт</h2>
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-white">
        <div className="text-sm opacity-80">Доступный баланс</div>
        <div className="text-4xl font-bold mt-1">{user?.bonusBalance} ₽</div>
        <div className="text-sm opacity-80 mt-1">≈ {user?.bonusBalance} бонусов</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Как получить больше бонусов</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">🛍️ За каждый заказ — 5% от суммы кэшбэком</li>
          <li className="flex items-start gap-2">⭐ За отзыв с фото — 50 бонусов</li>
          <li className="flex items-start gap-2">👥 За приглашённого друга — 200 бонусов</li>
          <li className="flex items-start gap-2">🎂 В день рождения — 300 бонусов</li>
        </ul>
      </div>
    </div>
  );
};

export const BuyerLayout: React.FC = () => {
  const { currentPage, navigate, user } = useStore();

  if (!user || (user.role !== 'buyer' && user.role !== 'seller')) {
    navigate('home');
    return null;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'buyer-orders': return <BuyerOrders />;
      case 'buyer-favorites': return <BuyerFavorites />;
      case 'buyer-bonuses': return <BuyerBonuses />;
      default: return <BuyerProfile />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Личный кабинет</h1>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-2">
                {user.name.charAt(0)}
              </div>
              <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <nav className="p-2">
              {navItems.map(({ page, label, icon: Icon }) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
