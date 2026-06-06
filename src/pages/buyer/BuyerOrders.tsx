import React, { useState } from 'react';
import { Package, MessageCircle, RotateCcw, AlertTriangle, Download, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { OrderStatus } from '../../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Новый', color: 'text-blue-700', bg: 'bg-blue-50' },
  paid: { label: 'Оплачен', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  accepted: { label: 'Принят', color: 'text-purple-700', bg: 'bg-purple-50' },
  manufacturing: { label: 'Изготавливается', color: 'text-amber-700', bg: 'bg-amber-50' },
  ready: { label: 'Готов к отправке', color: 'text-orange-700', bg: 'bg-orange-50' },
  shipped: { label: 'В доставке', color: 'text-blue-700', bg: 'bg-blue-50' },
  delivered: { label: 'Доставлен', color: 'text-teal-700', bg: 'bg-teal-50' },
  completed: { label: 'Завершён', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancelled: { label: 'Отменён', color: 'text-red-700', bg: 'bg-red-50' },
  return: { label: 'Возврат', color: 'text-rose-700', bg: 'bg-rose-50' },
  dispute: { label: 'Спор', color: 'text-red-700', bg: 'bg-red-50' },
};

export const BuyerOrders: React.FC = () => {
  const { orders, navigate, showNotification } = useStore();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Мои заказы</h2>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'paid', 'manufacturing', 'shipped', 'delivered', 'completed', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'all' ? 'Все' : statusConfig[f]?.label || f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Заказов пока нет</p>
          <button onClick={() => navigate('catalog')} className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors">
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const status = statusConfig[order.status];
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm">Заказ #{order.id}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{(order.totalAmount + order.deliveryAmount).toLocaleString()} ₽</div>
                      <div className="text-xs text-gray-500">{order.items.length} товара</div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.productImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">+{order.items.length - 3}</div>
                    )}
                  </div>

                  {/* Delivery method */}
                  <div className="text-xs text-gray-500 mb-3">
                    📦 {order.deliveryMethod} · {order.trackNumber ? `Трек: ${order.trackNumber}` : 'Трек-номер не указан'}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Подробнее <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    <button onClick={() => navigate('buyer-messages')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                      <MessageCircle size={12} />
                      Написать продавцу
                    </button>
                    {order.status === 'delivered' && (
                      <>
                        <button onClick={() => showNotification('Спор открыт', 'info')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                          <AlertTriangle size={12} />
                          Открыть спор
                        </button>
                        <button onClick={() => showNotification('Запрос на возврат отправлен', 'info')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                          <RotateCcw size={12} />
                          Возврат
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Download size={12} />
                      Чек
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <img src={item.productImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                            <div className="text-xs text-gray-500">{item.shopName} · {item.quantity} шт.</div>
                          </div>
                          <div className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} ₽</div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
                      <div className="flex justify-between text-sm text-gray-600"><span>Товары</span><span>{order.totalAmount.toLocaleString()} ₽</span></div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Доставка</span><span>{order.deliveryAmount.toLocaleString()} ₽</span></div>
                      <div className="flex justify-between text-sm font-bold text-gray-900"><span>Итого</span><span>{(order.totalAmount + order.deliveryAmount).toLocaleString()} ₽</span></div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      📍 {order.deliveryAddress} · Оплата: {order.paymentMethod}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
