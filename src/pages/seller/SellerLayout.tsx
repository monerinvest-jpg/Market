import React from 'react';
import { BarChart2, Package, ShoppingBag, DollarSign, Megaphone, Users, Home } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SellerDashboard } from './SellerDashboard';
import { SellerProducts } from './SellerProducts';
import { SellerOrders } from './SellerOrders';
import { SellerFinances } from './SellerFinances';


type SellerPage = 'seller-dashboard' | 'seller-products' | 'seller-orders' | 'seller-finances' | 'seller-analytics' | 'seller-promotion' | 'seller-referral';

const menuItems: { page: SellerPage; label: string; icon: React.ReactNode; badge?: number }[] = [
  { page: 'seller-dashboard', label: 'Главная', icon: <Home size={18} /> },
  { page: 'seller-products', label: 'Товары', icon: <Package size={18} /> },
  { page: 'seller-orders', label: 'Заказы', icon: <ShoppingBag size={18} />, badge: 3 },
  { page: 'seller-finances', label: 'Финансы', icon: <DollarSign size={18} /> },
  { page: 'seller-analytics', label: 'Аналитика', icon: <BarChart2 size={18} /> },
  { page: 'seller-promotion', label: 'Продвижение', icon: <Megaphone size={18} /> },
  { page: 'seller-referral', label: 'Реферальная', icon: <Users size={18} /> },
];

export const SellerLayout: React.FC = () => {
  const { currentPage, navigate } = useStore();

  const renderContent = () => {
    switch (currentPage as SellerPage) {
      case 'seller-dashboard': return <SellerDashboard />;
      case 'seller-products': return <SellerProducts />;
      case 'seller-orders': return <SellerOrders />;
      case 'seller-finances': return <SellerFinances />;
      case 'seller-analytics': return (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Аналитика</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Просмотры товаров', value: '12,450', trend: '+23%' },
              { label: 'В избранное', value: '847', trend: '+12%' },
              { label: 'В корзину', value: '312', trend: '+8%' },
              { label: 'Продаж', value: '43', trend: '+15%' },
              { label: 'Выручка', value: '87,400 ₽', trend: '+31%' },
              { label: 'Средний чек', value: '2,033 ₽', trend: '+5%' },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-emerald-600 font-medium">{stat.trend} за месяц</div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'seller-promotion': return (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Продвижение</h2>
          <div className="space-y-4">
            {[
              { title: '🚀 Поднять товар в поиске', desc: 'Ваш товар будет показываться в топе поиска в течение 7 дней', price: '500 ₽ / 7 дней' },
              { title: '⭐ Размещение в подборке', desc: 'Товар попадёт в тематическую подборку на главной странице', price: '1,000 ₽ / месяц' },
              { title: '🎯 Рекламный баннер', desc: 'Баннер магазина на главной странице каталога', price: '3,000 ₽ / месяц' },
              { title: '🏷️ Купон продавца', desc: 'Создайте персональный купон для покупателей', price: 'Бесплатно' },
            ].map(tool => (
              <div key={tool.title} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{tool.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{tool.desc}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-bold text-amber-600">{tool.price}</div>
                  <button className="mt-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors">
                    Подключить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'seller-referral': return (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Реферальная программа</h2>
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-2">Приглашайте — зарабатывайте</h3>
            <p className="text-sm opacity-90">Приведите покупателя по своей ссылке и получите сниженную комиссию 6% вместо 12% на его первый заказ</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ваши ссылки</h3>
            {['Ссылка для покупателей', 'Ссылка для продавцов'].map(type => (
              <div key={type} className="mb-3">
                <div className="text-xs text-gray-500 mb-1">{type}</div>
                <div className="flex gap-2">
                  <input readOnly value={`https://craftmarket.ru/ref/seller123`} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50" />
                  <button className="px-3 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium">Копировать</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      default: return <SellerDashboard />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-2 sticky top-24">
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Кабинет продавца</div>
            </div>
            {menuItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${currentPage === item.page ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={currentPage === item.page ? 'text-amber-500' : 'text-gray-400'}>{item.icon}</span>
                  {item.label}
                </div>
                {item.badge && (
                  <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
