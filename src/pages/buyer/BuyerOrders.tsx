import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { orderAPI } from '../../db/database';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const statusLabel: Record<string, { label: string; color: string }> = {
  new: { label: 'Новый', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Оплачен', color: 'bg-purple-100 text-purple-700' },
  accepted: { label: 'Принят', color: 'bg-indigo-100 text-indigo-700' },
  manufacturing: { label: 'Изготавливается', color: 'bg-yellow-100 text-yellow-700' },
  ready: { label: 'Готов', color: 'bg-teal-100 text-teal-700' },
  shipped: { label: 'В доставке', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Завершён', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-700' },
  return: { label: 'Возврат', color: 'bg-gray-100 text-gray-700' },
  dispute: { label: 'Спор', color: 'bg-red-100 text-red-700' },
};

export const BuyerOrders: React.FC = () => {
  const { user, navigate } = useStore();
  const orders = user ? orderAPI.getByUser(user.id) : [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
        <p className="text-gray-500 mb-6">Перейдите в каталог, чтобы сделать первый заказ</p>
        <button onClick={() => navigate('catalog')} className="px-6 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium">В каталог</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Мои заказы ({orders.length})</h2>
      {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
        const st = statusLabel[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };
        const expanded = expandedId === order.id;
        return (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : order.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">Заказ #{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>{st.label}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU')} • {order.items.length} товар(а) • {order.totalAmount.toLocaleString()} ₽
                </div>
              </div>
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {expanded && (
              <div className="border-t border-gray-100 p-4 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                      <div className="text-xs text-gray-500">{item.shopName} • {item.quantity} шт.</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} ₽</div>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Доставка</span><span>{order.deliveryAmount} ₽</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка</span><span>-{order.discountAmount} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Итого</span><span>{order.totalAmount.toLocaleString()} ₽</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>📍 {order.deliveryAddress}</div>
                  <div>🚚 {order.deliveryMethod} • 💳 {order.paymentMethod}</div>
                  {order.trackNumber && <div>📦 Трек-номер: <span className="font-mono font-semibold">{order.trackNumber}</span></div>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
