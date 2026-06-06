import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Shield, Truck, Clock, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { productAPI, shopAPI, reviewAPI } from '../db/database';

export const ProductPage: React.FC = () => {
  const { selectedProductId, navigate, addToCart, toggleFavorite, favorites } = useStore();
  const product = productAPI.getById(selectedProductId || '');
  const shop = product ? shopAPI.getById(product.shopId) : undefined;
  const reviews = product ? reviewAPI.getByProduct(product.id) : [];

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-4xl">😕</span>
        <h2 className="text-xl font-semibold text-gray-900 mt-4">Товар не найден</h2>
        <button onClick={() => navigate('catalog')} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl text-sm">В каталог</button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const variant = [selectedColor, selectedSize].filter(Boolean).join(', ');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => navigate('catalog')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
        <ArrowLeft size={16} /> Назад в каталог
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <img
              src={product.images[selectedImg]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop'; }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImg ? 'border-amber-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-xs text-amber-600 font-medium mb-2">{product.category}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <button onClick={() => navigate('shop', { shopId: product.shopId })} className="text-sm text-gray-500 hover:text-amber-600 mb-3 block">
            🏪 {product.shopName} • {product.city}
          </button>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} отзывов)</span>
              <span className="text-sm text-gray-400">• {product.salesCount} продаж</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{product.oldPrice.toLocaleString()} ₽</span>
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-lg">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Цвет: {selectedColor && <span className="font-normal text-gray-500">{selectedColor}</span>}</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 border-2 rounded-xl text-sm transition-all ${selectedColor === c ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Размер: {selectedSize && <span className="font-normal text-gray-500">{selectedSize}</span>}</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 border-2 rounded-xl text-sm transition-all ${selectedSize === s ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-50 text-gray-700 font-bold">−</button>
              <span className="px-4 py-3 font-semibold text-gray-900">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gray-50 text-gray-700 font-bold">+</button>
            </div>
            <button
              onClick={() => addToCart(product, qty, variant || undefined)}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white rounded-xl font-semibold transition-colors"
            >
              <ShoppingCart size={18} />
              {product.inStock ? 'В корзину' : 'Нет в наличии'}
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-3 rounded-xl border-2 transition-colors ${isFav ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300'}`}
            >
              <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
              <Shield size={18} className="text-green-500" />
              <span className="text-[10px] text-gray-600">Безопасная оплата</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
              <Clock size={18} className="text-blue-500" />
              <span className="text-[10px] text-gray-600">~{product.productionDays} дн. изготовление</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
              <Truck size={18} className="text-amber-500" />
              <span className="text-[10px] text-gray-600">Доставка по РФ</span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Materials + Tags */}
          {product.materials.length > 0 && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Материалы</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map(m => (
                  <span key={m} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Shop info */}
          {shop && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <button onClick={() => navigate('shop', { shopId: shop.id })} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors w-full text-left">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">🏪</div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{shop.name}</div>
                  <div className="text-xs text-gray-500">{shop.city} • ответ {shop.responseTime}</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Отзывы ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Пока нет отзывов. Будьте первым!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{rev.userName}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= rev.rating ? 'text-amber-400' : 'text-gray-200'} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <p className="text-sm text-gray-700">{rev.text}</p>
                {rev.sellerReply && (
                  <div className="mt-3 pl-4 border-l-2 border-amber-300">
                    <div className="text-xs font-semibold text-amber-700 mb-0.5">Ответ продавца:</div>
                    <p className="text-sm text-gray-600">{rev.sellerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
