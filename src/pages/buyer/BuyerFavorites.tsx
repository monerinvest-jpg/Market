import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { products } from '../../data/mockData';
import { ProductCard } from '../../components/common/ProductCard';

export const BuyerFavorites: React.FC = () => {
  const { favorites, navigate } = useStore();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart size={20} className="text-rose-500 fill-rose-500" />
        Избранное ({favoriteProducts.length})
      </h2>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Вы ещё не добавили товары в избранное</p>
          <button onClick={() => navigate('catalog')} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors">
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};
