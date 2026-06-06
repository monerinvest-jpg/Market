import React from 'react';
import { TrendingUp, Package, MessageCircle, Star, DollarSign, AlertTriangle, ShoppingBag, BarChart2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { sellerStats, mockOrders } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Янв', revenue: 12000 }, { name: 'Фев', revenue: 19000 }, { name: 'Мар', revenue: 15000 },
  { name: 'Апр', revenue: 24000 }, { name: 'Май', revenue: 18000 }, { name: 'Июн', revenue: 28000 },
  { name: 'Июл', revenue: 32000 },
];

export const SellerDashboard: React.FC = () => {
  const { navigate } = useStore();


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Панель продавца</h2>
        <button onClick={() => navigate('seller-products')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <Package size={16} />
          Добавить товар
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: <DollarSign size={20} className="text-emerald-500" />, value: `${sellerStats.revenue.toLocaleString()} ₽`, label: 'Выручка (месяц)', bg: 'bg-emerald-50' },
          { icon: <ShoppingBag size={20} className="text-blue-500" />, value: sellerStats.ordersCount, label: 'Заказов', bg: 'bg-blue-50' },
          { icon: <Star size={20} className="text-amber-500" />, value: sellerStats.shopRating, label: 'Рейтинг', bg: 'bg-amber-50' },
          { icon: <TrendingUp size={20} className="text-purple-500" />, value: `${sellerStats.pendingPayout.toLocaleString()} ₽`, label: 'К выплате', bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {sellerStats.newMessages > 0 && (
          <button onClick={() => navigate('buyer-messages')} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left hover:bg-blue-100 transition-colors">
            <MessageCircle size={20} className="text-blue-500" />
            <div>
              <div className="font-semibold text-blue-800 text-sm">Новые сообщения</div>
              <div className="text-xs text-blue-600">{sellerStats.newMessages} непрочитанных</div>
            </div>
          </button>
        )}
        {sellerStats.pendingModeration > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle size={20} className="text-amber-500" />
            <div>
              <div className="font-semibold text-amber-800 text-sm">На модерации</div>
              <div className="text-xs text-amber-600">{sellerStats.pendingModeration} товара ожидают проверки</div>
            </div>
          </div>
        )}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-amber-500" />Выручка по месяцам</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}к`} />
            <Tooltip formatter={(v: unknown) => [`${Number(v).toLocaleString()} ₽`, 'Выручка']} />
            <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Последние заказы</h3>
          <button onClick={() => navigate('seller-orders')} className="text-sm text-amber-600 hover:text-amber-700 font-medium">Все заказы →</button>
        </div>
        <div className="space-y-3">
          {mockOrders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={order.items[0].productImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{order.items[0].productName}</div>
                <div className="text-xs text-gray-500">#{order.id} · {order.deliveryMethod}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{order.totalAmount.toLocaleString()} ₽</div>
                <div className="text-xs text-amber-600 font-medium">{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
