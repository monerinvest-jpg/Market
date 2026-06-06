import React, { useState } from 'react';
import { productAPI } from '../../db/database';
import { useStore } from '../../store/useStore';
import { Check, X, Trash2, Search } from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-600',
  draft: 'bg-gray-100 text-gray-500',
};
const statusLabels: Record<string, string> = {
  active: 'Активен', pending: 'На модерации', rejected: 'Отклонён', archived: 'В архиве', draft: 'Черновик',
};

export const AdminProducts: React.FC = () => {
  const { showNotification } = useStore();
  const [products, setProducts] = useState(productAPI.getAll());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const reload = () => setProducts(productAPI.getAll());

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.shopName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = (id: string) => {
    productAPI.approve(id);
    reload();
    showNotification('Товар одобрен!', 'success');
  };

  const handleReject = (id: string) => {
    productAPI.reject(id);
    reload();
    showNotification('Товар отклонён', 'info');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Удалить товар?')) return;
    productAPI.delete(id);
    reload();
    showNotification('Товар удалён', 'success');
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Товары ({filtered.length})</h2>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск товара..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'rejected', 'archived'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f === 'all' ? 'Все' : statusLabels[f]}
              {f === 'pending' && products.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{products.filter(p => p.status === 'pending').length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(product => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3">
            <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop'; }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{product.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{product.shopName} • {product.category} • {product.price.toLocaleString()} ₽</div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${statusColors[product.status]}`}>
                {statusLabels[product.status]}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {product.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(product.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="Одобрить">
                    <Check size={16} />
                  </button>
                  <button onClick={() => handleReject(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Отклонить">
                    <X size={16} />
                  </button>
                </>
              )}
              <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm">Товары не найдены</div>
        )}
      </div>
    </div>
  );
};
