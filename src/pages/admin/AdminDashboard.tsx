import React from 'react';
import { statsAPI, orderAPI, productAPI } from '../../db/database';
import { Users, Package, ShoppingBag, DollarSign, Store, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = statsAPI.getDashboard();
  const recentOrders = orderAPI.getAll().slice(-5).reverse();
  const pendingProducts = productAPI.getAll().filter(p => p.status === 'pending');

  const cards = [
    { label: 'Покупателей', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600', bg: 'border-blue-200' },
    { label: 'Продавцов', value: stats.totalSellers, icon: Store, color: 'bg-purple-50 text-purple-600', bg: 'border-purple-200' },
    { label: 'Активных товаров', value: stats.totalProducts, icon: Package, color: 'bg-green-50 text-green-600', bg: 'border-green-200' },
    { label: 'Заказов', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600', bg: 'border-orange-200' },
    { label: 'Выручка', value: `${stats.totalRevenue.toLocaleString()} ₽`, icon: DollarSign, color: 'bg-amber-50 text-amber-600', bg: 'border-amber-200' },
    { label: 'На модерации', value: stats.pendingProducts, icon: AlertTriangle, color: 'bg-red-50 text-red-600', bg: 'border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
        <p className="text-gray-500 text-sm mt-1">Обзор всей системы в реальном времени</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`bg-white border ${card.bg} rounded-2xl p-4`}>
            <div className={`inline-flex p-2 rounded-xl ${card.color.split(' ')[0]}`}>
              <card.icon size={18} className={card.color.split(' ')[1]} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{card.value}</div>
            <div className="text-xs text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">Последние заказы</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Нет заказов</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-mono text-xs">#{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${order.status === 'paid' ? 'bg-purple-100 text-purple-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {order.status}
                  </span>
                  <span className="ml-auto font-semibold text-gray-900">{order.totalAmount.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending products */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">
            Товары на модерации
            {pendingProducts.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingProducts.length}</span>}
          </h3>
          {pendingProducts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">✅ Нет товаров на модерации</p>
          ) : (
            <div className="space-y-2">
              {pendingProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-xl">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.shopName}</div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{p.price.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-2">📊 Быстрая сводка</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-gray-300 text-xs">Новых заказов</div>
            <div className="text-xl font-bold mt-0.5">{stats.newOrders}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-gray-300 text-xs">Магазинов</div>
            <div className="text-xl font-bold mt-0.5">{stats.totalShops}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
