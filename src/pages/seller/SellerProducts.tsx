import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { shopAPI, productAPI } from '../../db/database';
import { PlusCircle, Edit2, Trash2, Package } from 'lucide-react';

export const SellerProducts: React.FC = () => {
  const { user, navigate, showNotification } = useStore();
  const shop = user ? shopAPI.getBySeller(user.id) : undefined;
  const [products, setProducts] = React.useState(shop ? productAPI.getByShop(shop.id) : []);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter);

  const handleDelete = (id: string) => {
    if (!confirm('Удалить товар?')) return;
    productAPI.delete(id);
    setProducts(shop ? productAPI.getByShop(shop.id) : []);
    showNotification('Товар удалён', 'success');
  };

  const handleToggleStatus = (id: string, current: string) => {
    const newStatus = current === 'active' ? 'archived' : 'active';
    productAPI.update(id, { status: newStatus as any });
    setProducts(shop ? productAPI.getByShop(shop.id) : []);
    showNotification(`Статус изменён на "${newStatus === 'active' ? 'Активен' : 'В архиве'}"`, 'success');
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-700',
    archived: 'bg-gray-100 text-gray-500',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    active: 'Активен', pending: 'На модерации', draft: 'Черновик', archived: 'В архиве', rejected: 'Отклонён',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Мои товары ({products.length})</h2>
        <button onClick={() => navigate('seller-product-new')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <PlusCircle size={15} /> Добавить
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'pending', 'archived'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f === 'all' ? 'Все' : statusLabels[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Товаров нет</p>
          <button onClick={() => navigate('seller-product-new')} className="mt-3 px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium">Добавить товар</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(product => (
            <div key={product.id} className="flex gap-3 p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{product.category} • {product.price.toLocaleString()} ₽</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[product.status] || 'bg-gray-100'}`}>
                    {statusLabels[product.status] || product.status}
                  </span>
                  <span className="text-[10px] text-gray-400">{product.reviewCount} отзывов • {product.salesCount} продаж</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggleStatus(product.id, product.status)} className="p-2 text-gray-400 hover:text-blue-500 text-xs rounded-lg hover:bg-blue-50 transition-colors">
                  {product.status === 'active' ? '⏸' : '▶'}
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
