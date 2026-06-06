import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { navigate, addToCart, toggleFavorite, favorites } = useStore();
  const isFav = favorites.includes(product.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer" onClick={() => navigate('product', { productId: product.id })}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop'; }}
        />
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-lg">Нет в наличии</span>
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}
          className={`absolute top-2 right-2 p-2 rounded-xl transition-colors ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'}`}
        >
          <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <button
          onClick={() => navigate('shop', { shopId: product.shopId })}
          className="text-xs text-amber-600 hover:underline font-medium mb-1 block"
        >
          {product.shopName}
        </button>
        <button
          onClick={() => navigate('product', { productId: product.id })}
          className="text-sm font-medium text-gray-900 hover:text-amber-700 line-clamp-2 text-left leading-snug"
        >
          {product.name}
        </button>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={11} className="text-amber-400" fill="currentColor" />
            <span className="text-xs text-gray-700 font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{product.oldPrice.toLocaleString()} ₽</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white rounded-xl transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        {product.city && (
          <div className="text-[10px] text-gray-400 mt-1.5">📍 {product.city}</div>
        )}
      </div>
    </div>
  );
};
