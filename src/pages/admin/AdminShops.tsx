import React, { useState } from 'react';
import { shopAPI } from '../../db/database';
import { useStore } from '../../store/useStore';
import { Check, Ban, Star } from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  blocked: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  active: '✅ Активен', pending: '⏳ На модерации', blocked: '🔴 Заблокирован',
  draft: 'Черновик', rejected: 'Отклонён',
};

export const AdminShops: React.FC = () => {
  const { showNotification } = useStore();
  const [shops, setShops] = useState(shopAPI.getAll());

  const reload = () => setShops(shopAPI.getAll());

  const handleApprove = (id: string) => {
    shopAPI.approve(id);
    reload();
    showNotification('Магазин одобрен!', 'success');
  };

  const handleBlock = (id: string) => {
    shopAPI.block(id);
    reload();
    showNotification('Статус магазина изменён', 'info');
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Магазины ({shops.length})</h2>

      <div className="space-y-3">
        {shops.map(shop => (
          <div key={shop.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
            {shop.logo ? (
              <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏪</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">{shop.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{shop.city} • {shop.salesCount} продаж</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[shop.status] || 'bg-gray-100'}`}>
                  {statusLabels[shop.status] || shop.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={11} className="text-amber-400" fill="currentColor" />
                  {shop.rating} ({shop.reviewCount})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {shop.status === 'pending' && (
                <button onClick={() => handleApprove(shop.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors">
                  <Check size={12} /> Одобрить
                </button>
              )}
              <button onClick={() => handleBlock(shop.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${shop.status === 'blocked' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                <Ban size={12} /> {shop.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
              </button>
            </div>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm">Магазины не найдены</div>
        )}
      </div>
    </div>
  );
};
