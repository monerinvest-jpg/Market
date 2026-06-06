import React from 'react';
import { ArrowLeft, Star, MapPin, Clock, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { shopAPI, productAPI } from '../db/database';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const { selectedShopId, navigate } = useStore();
  const shop = shopAPI.getById(selectedShopId || '');
  const products = shop ? productAPI.getByShop(shop.id).filter(p => p.status === 'active') : [];

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-4xl">😕</span>
        <h2 className="text-xl font-semibold text-gray-900 mt-4">Магазин не найден</h2>
        <button onClick={() => navigate('catalog')} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl text-sm">В каталог</button>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-amber-100 to-orange-100">
        {shop.banner && <img src={shop.banner} alt="" className="w-full h-full object-cover" />}
        <button onClick={() => navigate('catalog')} className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-white transition-colors">
          <ArrowLeft size={14} /> Назад
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Shop header */}
        <div className="flex items-start gap-4 -mt-8 mb-8">
          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
            {shop.logo ? (
              <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={13} /> {shop.city}</span>
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-400" fill="currentColor" />
                {shop.rating} ({shop.reviewCount} отзывов)
              </span>
              <span className="flex items-center gap-1"><Package size={13} /> {shop.salesCount} продаж</span>
              <span className="flex items-center gap-1"><Clock size={13} /> ответ {shop.responseTime}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <p className="text-gray-600 text-sm leading-relaxed">{shop.description}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2">
            <div>
              <span className="font-semibold text-gray-700">Доставка:</span>
              <p className="text-gray-500 text-xs mt-0.5">{shop.deliveryConditions}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Возврат:</span>
              <p className="text-gray-500 text-xs mt-0.5">{shop.returnConditions}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Товары ({products.length})</h2>
        {products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">В этом магазине пока нет товаров</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};
