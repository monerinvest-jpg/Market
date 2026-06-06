import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { shopAPI, orderAPI } from '../../db/database';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../../types';

const STATUS_FLOW: Order['status'][] = ['new', 'paid', 'accepted', 'manufacturing', 'ready', 'shipped', 'delivered', 'completed'];
const statusLabel: Record<string, string> = {
  new: 'Новый', paid: 'Оплачен', accepted: 'Принят', manufacturing: 'Изготавливается',
  ready: 'Готов', shipped: 'Отправлен', delivered: 'Доставлен', completed: 'Завершён',
  cancelled: 'Отменён', return: 'Возврат', dispute: 'Спор',
};

export const SellerOrders: React.FC = () => {
  const { user, showNotification } = useStore();
  const shop = user ? shopAPI.getBySeller(user.id) : undefined;
  const [orders, setOrders] = React.useState(shop ? orderAPI.getByShop(shop.id) : []);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleNextStatus = (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[idx + 1];
      orderAPI.updateStatus(order.id, next);
      setOrders(shop ? orderAPI.getByShop(shop.id) : []);
      showNotification(`Статус изменён: ${statusLabel[next]}`, 'success');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
        <p className="text-gray-500">Здесь будут отображаться заказы покупателей</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Заказы ({orders.length})</h2>
      {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
        const expanded = expandedId === order.id;
        const idx = STATUS_FLOW.indexOf(order.status);
        const canAdvance = idx >= 0 && idx < STATUS_FLOW.length - 1;

        return (
          <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : order.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">#{order.id}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[11px] font-semibold">
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU')} • {order.totalAmount.toLocaleString()} ₽
                </div>
              </div>
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {expanded && (
              <div className="border-t border-gray-100 p-4 space-y-3">
                {order.items.filter(i => i.shopId === shop?.id).map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                      <div className="text-xs text-gray-500">{item.quantity} шт. × {item.price.toLocaleString()} ₽</div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-gray-500 space-y-0.5 pt-2 border-t border-gray-100">
                  <div>📍 {order.deliveryAddress}</div>
                  <div>🚚 {order.deliveryMethod}</div>
                </div>
                {canAdvance && (
                  <button
                    onClick={() => handleNextStatus(order)}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Перевести → {statusLabel[STATUS_FLOW[idx + 1]]}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
