import React, { useState } from 'react';
import { Star, MapPin, Clock, MessageCircle, Heart, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { shops, products, reviews } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const { selectedShopId, navigate, isLoggedIn, openAuthModal, showNotification } = useStore();
  const shop = shops.find(s => s.id === selectedShopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const shopReviews = reviews.filter(r => r.shopId === shop.id);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'info'>('products');

  const handleSubscribe = () => {
    if (!isLoggedIn) { openAuthModal(); return; }
    setIsSubscribed(!isSubscribed);
    showNotification(isSubscribed ? 'Вы отписались от магазина' : 'Вы подписались на магазин', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-amber-100 to-rose-100 h-40 mb-0 relative">
        {shop.banner ? (
          <img src={shop.banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-200 to-rose-200" />
        )}
      </div>

      {/* Shop header */}
      <div className="bg-white rounded-2xl border border-gray-100 -mt-8 mx-4 p-5 shadow-sm mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-amber-50 flex items-center justify-center">
            {shop.logo ? (
              <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-gray-500 text-sm"><MapPin size={14} />{shop.city}</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= Math.round(shop.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                    <span className="text-sm font-medium text-gray-700 ml-1">{shop.rating}</span>
                    <span className="text-sm text-gray-500">({shop.reviewCount})</span>
                  </div>
                  <span className="text-sm text-gray-500">{shop.salesCount} продаж</span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm"><Clock size={14} />Ответ {shop.responseTime}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubscribe}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${isSubscribed ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}
                >
                  <Heart size={15} fill={isSubscribed ? 'currentColor' : 'none'} />
                  {isSubscribed ? 'Отписаться' : 'Подписаться'}
                </button>
                <button
                  onClick={() => isLoggedIn ? navigate('buyer-messages') : openAuthModal()}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={15} />
                  Написать
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mt-4">{shop.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ['🛍️', shopProducts.length, 'товаров'],
          ['⭐', shop.rating, 'рейтинг'],
          ['📦', shop.salesCount, 'продаж'],
        ].map(([icon, value, label]) => (
          <div key={String(label)} className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {(['products', 'reviews', 'info'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab === 'products' ? `Товары (${shopProducts.length})` : tab === 'reviews' ? `Отзывы (${shopReviews.length})` : 'О магазине'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'products' && (
        shopProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Товары ещё не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {shopProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {shopReviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Пока нет отзывов</div>
          ) : (
            shopReviews.map(rev => (
              <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{rev.userName}</div>
                      <div className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{rev.text}</p>
                <div className="flex gap-4 mt-2">
                  {[['Качество', rev.qualityRating], ['Доставка', rev.deliveryRating], ['Общение', rev.communicationRating]].map(([l, v]) => (
                    <div key={String(l)} className="text-xs text-gray-500">{l}: <span className="text-amber-600 font-medium">{v}/5</span></div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Условия доставки</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{shop.deliveryConditions}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Условия возврата</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{shop.returnConditions}</p>
          </div>
        </div>
      )}
    </div>
  );
};
