import React, { useState } from 'react';
import { Truck, CheckCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockOrders } from '../../data/mockData';
import { OrderStatus } from '../../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Новый', color: 'text-blue-700', bg: 'bg-blue-50' },
  paid: { label: 'Оплачен', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  accepted: { label: 'Принят', color: 'text-purple-700', bg: 'bg-purple-50' },
  manufacturing: { label: 'Изготавливается', color: 'text-amber-700', bg: 'bg-amber-50' },
  ready: { label: 'Готов', color: 'text-orange-700', bg: 'bg-orange-50' },
  shipped: { label: 'Отправлен', color: 'text-blue-700', bg: 'bg-blue-50' },
  delivered: { label: 'Доставлен', color: 'text-teal-700', bg: 'bg-teal-50' },
  completed: { label: 'Завершён', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancelled: { label: 'Отменён', color: 'text-red-700', bg: 'bg-red-50' },
  return: { label: 'Возврат', color: 'text-rose-700', bg: 'bg-rose-50' },
  dispute: { label: 'Спор', color: 'text-red-700', bg: 'bg-red-50' },
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: 'accepted', accepted: 'manufacturing', manufacturing: 'ready', ready: 'shipped', shipped: 'delivered', delivered: 'completed',
};

export const SellerOrders: React.FC = () => {
  const { navigate, showNotification } = useStore();
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showNotification(`Статус заказа обновлён: ${statusConfig[status].label}`, 'success');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Заказы</h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'paid', 'manufacturing', 'shipped', 'delivered', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'all' ? 'Все' : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => {
          const status = statusConfig[order.status];
          const next = nextStatus[order.status];
          return (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">#{order.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>{status.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{order.totalAmount.toLocaleString()} ₽</div>
                  <div className="text-xs text-gray-500">Доставка: {order.deliveryAmount} ₽</div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img src={item.productImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-medium text-gray-800 line-clamp-1">{item.productName}</div>
                      <div className="text-xs text-gray-500">{item.quantity} шт. · {item.price.toLocaleString()} ₽</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 mb-3">
                📍 {order.deliveryAddress} · {order.deliveryMethod}
                {order.trackNumber && ` · Трек: ${order.trackNumber}`}
              </div>

              <div className="flex flex-wrap gap-2">
                {next && (
                  <button onClick={() => updateStatus(order.id, next)} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors">
                    <CheckCircle size={13} />
                    Перевести: {statusConfig[next].label}
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => { const trackNum = prompt('Введите трек-номер:'); if (trackNum) { setOrders(prev => prev.map(o => o.id === order.id ? { ...o, trackNumber: trackNum, status: 'shipped' } : o)); showNotification('Трек-номер добавлен', 'success'); }}} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors">
                    <Truck size={13} />
                    Добавить трек
                  </button>
                )}
                <button onClick={() => navigate('buyer-messages')} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-medium transition-colors">
                  <MessageCircle size={13} />
                  Написать
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
