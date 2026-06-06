import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Package, Truck, Shield, MessageCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { products, reviews } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';

export const ProductPage: React.FC = () => {
  const { selectedProductId, navigate, addToCart, toggleFavorite, favorites, isLoggedIn, openAuthModal } = useStore();
  const product = products.find(p => p.id === selectedProductId) || products[0];
  const productReviews = reviews.filter(r => r.productId === product.id);
  const similarProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'delivery'>('description');

  const isFav = favorites.includes(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize || selectedColor);
    if (isLoggedIn) navigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-amber-600">Главная</button>
        <span>/</span>
        <button onClick={() => navigate('catalog')} className="hover:text-amber-600">Каталог</button>
        <span>/</span>
        <button onClick={() => navigate('catalog', { categoryId: product.categoryId })} className="hover:text-amber-600">{product.category}</button>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
            <img src={product.images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.oldPrice && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
              {product.isDigital && <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">Цифровой</span>}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${currentImage === i ? 'border-amber-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            ⚠️ Товар ручной работы. Возможны небольшие отличия от фото — это особенность авторских изделий.
          </div>
        </div>

        {/* Info */}
        <div>
          <button onClick={() => navigate('shop', { shopId: product.shopId })} className="text-amber-600 hover:text-amber-700 font-medium text-sm mb-2 flex items-center gap-1">
            🏪 {product.shopName} · {product.city}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />)}
              <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} отзывов)</span>
            </div>
            <span className="text-sm text-gray-500">{product.salesCount} продаж</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-gray-900">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && <span className="text-lg text-gray-400 line-through">{product.oldPrice.toLocaleString()} ₽</span>}
          </div>

          {/* Variants */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Размер: <span className="text-amber-600">{selectedSize}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${selectedSize === s ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Цвет: <span className="text-amber-600">{selectedColor}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${selectedColor === c ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Customization */}
          {product.isCustomizable && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">✏️ Персонализация</div>
              <textarea
                value={customNote}
                onChange={e => setCustomNote(e.target.value)}
                placeholder="Введите пожелания (имя, надпись, размеры и пр.)"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold">−</button>
              <span className="px-4 py-2 font-semibold text-gray-900">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold">+</button>
            </div>
            <span className="text-sm text-gray-500">В наличии: {product.stockCount} шт.</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-4">
            <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-base transition-colors">
              <ShoppingCart size={20} />
              В корзину
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors ${isFav && isLoggedIn ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500'}`}
            >
              <Heart size={20} fill={isFav && isLoggedIn ? 'currentColor' : 'none'} />
            </button>
            <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          <button onClick={() => isLoggedIn ? navigate('buyer-messages') : openAuthModal()} className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 hover:bg-gray-50 rounded-2xl text-sm font-medium text-gray-700 transition-colors mb-6">
            <MessageCircle size={16} />
            Задать вопрос продавцу
          </button>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Package size={20} className="text-amber-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Изготовление</div>
              <div className="text-sm font-semibold text-gray-800">{product.productionDays > 0 ? `${product.productionDays} дн.` : 'Сразу'}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Truck size={20} className="text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Доставка</div>
              <div className="text-sm font-semibold text-gray-800">от 300 ₽</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Shield size={20} className="text-emerald-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Возврат</div>
              <div className="text-sm font-semibold text-gray-800">14 дней</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {(['description', 'reviews', 'delivery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab === 'description' ? 'Описание' : tab === 'reviews' ? `Отзывы (${productReviews.length})` : 'Доставка'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' && (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
            <div className="space-y-2">
              {product.materials.length > 0 && <div className="flex gap-3"><span className="text-sm text-gray-500 w-28">Материалы:</span><span className="text-sm text-gray-800 font-medium">{product.materials.join(', ')}</span></div>}
              {product.colors.length > 0 && <div className="flex gap-3"><span className="text-sm text-gray-500 w-28">Цвета:</span><span className="text-sm text-gray-800 font-medium">{product.colors.join(', ')}</span></div>}
              {product.weight && <div className="flex gap-3"><span className="text-sm text-gray-500 w-28">Вес:</span><span className="text-sm text-gray-800 font-medium">{product.weight} г</span></div>}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"># {tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="mb-12">
          {productReviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Пока нет отзывов. Будьте первым!</div>
          ) : (
            <div className="space-y-4">
              {productReviews.map(rev => (
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
                  <p className="text-gray-700 text-sm mb-3">{rev.text}</p>
                  {rev.sellerReply && (
                    <div className="ml-4 pl-4 border-l-2 border-amber-200 bg-amber-50 p-3 rounded-r-xl">
                      <div className="text-xs font-semibold text-amber-700 mb-1">Ответ продавца:</div>
                      <p className="text-sm text-gray-700">{rev.sellerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Truck size={18} className="text-blue-500" />Способы доставки</h3>
            <ul className="space-y-2">
              {product.deliveryMethods.map(m => <li key={m} className="flex items-center gap-2 text-sm text-gray-700"><span className="w-2 h-2 bg-amber-400 rounded-full" />{m}</li>)}
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Shield size={18} className="text-emerald-500" />Условия возврата</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Возврат товара надлежащего качества возможен в течение 14 дней с момента получения. Для персонализированных товаров возврат ограничен.</p>
          </div>
        </div>
      )}

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Похожие товары</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};
