import React from 'react';
import { Heart, Star, ShoppingCart, Package } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleFavorite, favorites, isLoggedIn } = useStore();
  const isFav = favorites.includes(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => navigate('product', { productId: product.id })}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.oldPrice && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
          {product.isDigital && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Цифровой</span>
          )}
          {product.isCustomizable && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Под заказ</span>
          )}
        </div>
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav && isLoggedIn ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-rose-500'}`}
        >
          <Heart size={15} fill={isFav && isLoggedIn ? 'currentColor' : 'none'} />
        </button>
        {/* Quick add to cart */}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full shadow-lg transition-all duration-200 whitespace-nowrap"
        >
          <ShoppingCart size={13} />
          В корзину
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <button
          onClick={() => navigate('shop', { shopId: product.shopId })}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium mb-1 truncate block"
        >
          {product.shopName}
        </button>
        <button
          onClick={() => navigate('product', { productId: product.id })}
          className="text-sm font-medium text-gray-800 hover:text-amber-700 text-left line-clamp-2 leading-snug mb-2 block"
        >
          {product.name}
        </button>
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">{product.oldPrice.toLocaleString()} ₽</span>
            )}
          </div>
          {product.productionDays > 0 ? (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Package size={11} />
              {product.productionDays} д.
            </div>
          ) : (
            <span className="text-xs text-green-600 font-medium">Сразу</span>
          )}
        </div>
      </div>
    </div>
  );
};
