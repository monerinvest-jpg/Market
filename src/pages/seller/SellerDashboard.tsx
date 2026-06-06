import React from 'react';
import { useStore } from '../../store/useStore';
import { shopAPI, productAPI, orderAPI } from '../../db/database';
import { Package, ShoppingBag, DollarSign, Star, TrendingUp } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { user, navigate } = useStore();
  const shop = user ? shopAPI.getBySeller(user.id) : undefined;
  const myProducts = user ? productAPI.getByShop(shop?.id || '') : [];
  const myOrders = shop ? orderAPI.getByShop(shop.id) : [];
  const revenue = myOrders.filter(o => ['paid', 'delivered', 'completed', 'shipped'].includes(o.status)).reduce((s, o) => {
    const shopItems = o.items.filter(i => i.shopId === shop?.id);
    return s + shopItems.reduce((ss, i) => ss + i.price * i.quantity, 0);
  }, 0);

  const stats = [
    { label: 'Товаров', value: myProducts.filter(p => p.status === 'active').length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Заказов', value: myOrders.length, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Выручка', value: `${revenue.toLocaleString()} ₽`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Рейтинг', value: shop?.rating.toFixed(1) || '—', icon: Star, color: 'bg-amber-50 text-amber-600' },
  ];

  if (!shop) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl">🏪</span>
        <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">Магазин не создан</h3>
        <p className="text-gray-500 mb-6">Чтобы начать продавать, создайте магазин</p>
        <button className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold">Создать магазин</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
          <p className="text-sm text-gray-500">{shop.city} • {shop.responseTime}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {shop.status === 'active' ? '✅ Активен' : '⏳ На модерации'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.color.split(' ')[0]} rounded-2xl p-4`}>
            <s.icon size={20} className={s.color.split(' ')[1]} />
            <div className="text-xl font-bold text-gray-900 mt-2">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Последние заказы</h3>
          <button onClick={() => navigate('seller-orders')} className="text-sm text-amber-600 hover:underline">Все →</button>
        </div>
        {myOrders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <ShoppingBag size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Заказов пока нет</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Заказ #{order.id}</div>
                  <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <span className="text-sm font-bold text-gray-900">{order.totalAmount.toLocaleString()} ₽</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${order.status === 'paid' ? 'bg-purple-100 text-purple-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
        <TrendingUp size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-blue-900 text-sm">Советы по продажам</div>
          <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
            <li>📸 Добавляйте качественные фото товаров</li>
            <li>⚡ Отвечайте на сообщения быстро</li>
            <li>🏷️ Используйте актуальные теги</li>
            <li>⭐ Просите покупателей оставлять отзывы</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
