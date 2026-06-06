import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { productAPI } from '../../db/database';
import { ProductCard } from '../../components/ProductCard';

export const BuyerFavorites: React.FC = () => {
  const { favorites, navigate } = useStore();
  const products = productAPI.getAll().filter(p => favorites.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Избранное пусто</h3>
        <p className="text-gray-500 mb-6">Добавляйте понравившиеся товары в избранное</p>
        <button onClick={() => navigate('catalog')} className="px-6 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium">В каталог</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Избранное ({products.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};
