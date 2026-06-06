import React, { useState } from 'react';
import { orderAPI, userAPI } from '../../db/database';
import { useStore } from '../../store/useStore';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Order } from '../../types';

const statusLabel: Record<string, string> = {
  new: 'Новый', paid: 'Оплачен', accepted: 'Принят', manufacturing: 'Изготавливается',
  ready: 'Готов', shipped: 'Отправлен', delivered: 'Доставлен', completed: 'Завершён',
  cancelled: 'Отменён', return: 'Возврат', dispute: 'Спор',
};
const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', paid: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};
const allStatuses: Order['status'][] = ['new', 'paid', 'accepted', 'manufacturing', 'ready', 'shipped', 'delivered', 'completed', 'cancelled'];

export const AdminOrders: React.FC = () => {
  const { showNotification } = useStore();
  const [orders, setOrders] = useState(orderAPI.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reload = () => setOrders(orderAPI.getAll());

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.id.includes(search) || o.userId.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (id: string, status: Order['status']) => {
    orderAPI.updateStatus(id, status);
    reload();
    showNotification('Статус заказа обновлён', 'success');
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Заказы ({filtered.length})</h2>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по ID..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
          <option value="all">Все статусы</option>
          {allStatuses.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(order => {
          const user = userAPI.getById(order.userId);
          const expanded = expandedId === order.id;
          return (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedId(expanded ? null : order.id)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-600">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                    <span className="text-xs text-gray-500">{user?.name || order.userId}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleString('ru-RU')} • {order.totalAmount.toLocaleString()} ₽</div>
                </div>
                {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
              </button>

              {expanded && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-500">{item.shopName} • {item.quantity} шт. × {item.price.toLocaleString()} ₽</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500">📍 {order.deliveryAddress}</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Изменить статус:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {allStatuses.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(order.id, s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${order.status === s ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600 hover:border-amber-400'}`}
                        >
                          {statusLabel[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm">Заказы не найдены</div>
        )}
      </div>
    </div>
  );
};
