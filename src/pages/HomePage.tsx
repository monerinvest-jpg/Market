import React from 'react';
import { ArrowRight, Shield, Truck, Star, Gift, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories, products, shops } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';

const collections = [
  { title: 'Подарки к праздникам', emoji: '🎁', tag: 'Подарки', bg: 'from-rose-400 to-pink-500' },
  { title: 'Товары недели', emoji: '🔥', tag: 'Хиты', bg: 'from-amber-400 to-orange-500' },
  { title: 'Российские мастера', emoji: '🇷🇺', tag: 'Россия', bg: 'from-blue-500 to-indigo-600' },
  { title: 'Новинки', emoji: '✨', tag: 'Новое', bg: 'from-emerald-400 to-teal-500' },
];

export const HomePage: React.FC = () => {
  const { navigate, openAuthModal, isLoggedIn } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-amber-700 border border-amber-200 mb-6">
                <span>✨</span> Более 50 000 уникальных товаров
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Найди что-то{' '}
                <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                  особенное
                </span>
                <br />от российских мастеров
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Уникальные товары ручной работы, дизайнерские изделия и авторская косметика прямо от создателей. Каждая покупка поддерживает малый бизнес России.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('catalog')}
                  className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-amber-200 transition-all"
                >
                  <Gift size={20} />
                  Найти подарок
                </button>
                <button
                  onClick={() => isLoggedIn ? navigate('seller-onboarding') : openAuthModal('register')}
                  className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl font-bold text-lg border-2 border-gray-200 transition-all"
                >
                  Открыть магазин
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex gap-8 mt-8">
                {[['10K+', 'Мастеров'], ['50K+', 'Товаров'], ['4.8★', 'Средний рейтинг']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-black text-gray-900">{v}</div>
                    <div className="text-sm text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform ${i === 1 ? 'mt-8' : ''} ${i === 3 ? '-mt-8' : ''}`} onClick={() => navigate('product', { productId: p.id })}>
                  <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Популярные категории</h2>
          <button onClick={() => navigate('catalog')} className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            Все категории <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(0, 10).map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('catalog', { categoryId: cat.id })}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50 hover:shadow-md transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center leading-snug">{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.productCount.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Подборки</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((col) => (
            <button
              key={col.title}
              onClick={() => navigate('catalog')}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${col.bg} text-white text-left overflow-hidden group hover:scale-105 transition-transform shadow-lg`}
            >
              <div className="text-4xl mb-3">{col.emoji}</div>
              <div className="text-sm font-medium opacity-80">{col.tag}</div>
              <div className="text-base font-bold leading-tight">{col.title}</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Рекомендуемые товары</h2>
          <button onClick={() => navigate('catalog')} className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            Все товары <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...featuredProducts, ...products].slice(0, 10).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Shops */}
      <section className="bg-gradient-to-r from-amber-50 to-rose-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Рекомендуемые магазины</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {shops.map(shop => (
              <button
                key={shop.id}
                onClick={() => navigate('shop', { shopId: shop.id })}
                className="bg-white rounded-2xl p-4 text-left border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🏪</span>
                  )}
                </div>
                <div className="font-semibold text-gray-900 text-sm group-hover:text-amber-700 transition-colors">{shop.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{shop.city}</div>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-700">{shop.rating}</span>
                  <span className="text-xs text-gray-400">({shop.salesCount} продаж)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Почему покупают у нас</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Shield size={28} className="text-emerald-500" />, title: 'Защита покупателя', desc: 'Гарантируем возврат средств при возникновении проблем с заказом' },
            { icon: <Truck size={28} className="text-blue-500" />, title: 'Удобная доставка', desc: 'СДЭК, Почта России, Яндекс Доставка и другие службы' },
            { icon: <Star size={28} className="text-amber-500" />, title: 'Проверенные мастера', desc: 'Каждый продавец проходит модерацию перед публикацией' },
            { icon: <Heart size={28} className="text-rose-500" />, title: 'Уникальные изделия', desc: 'Только авторские и handmade товары, не масс-маркет' },
          ].map(item => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Как это работает</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Найдите товар', desc: 'Используйте поиск или каталог для поиска уникального изделия', emoji: '🔍' },
              { step: '02', title: 'Оформите заказ', desc: 'Добавьте товар в корзину и укажите данные доставки', emoji: '🛒' },
              { step: '03', title: 'Оплатите', desc: 'Безопасная оплата через ЮKassa: карта, СБП и другие методы', emoji: '💳' },
              { step: '04', title: 'Получите', desc: 'Мастер создаст и отправит ваш заказ. Получите и оставьте отзыв!', emoji: '📦' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <div className="text-sm text-amber-400 font-bold mb-2">Шаг {item.step}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="bg-gradient-to-r from-amber-500 to-rose-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🏺</div>
          <h2 className="text-3xl font-black text-white mb-4">Вы мастер или малый бренд?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Откройте свой магазин на CraftMarket и начните продавать тысячам покупателей по всей России. Бесплатная регистрация, минимальная комиссия.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => isLoggedIn ? navigate('seller-onboarding') : openAuthModal('register')}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-amber-600 rounded-2xl font-bold text-lg transition-all shadow-lg"
            >
              Открыть магазин бесплатно
            </button>
            <button onClick={() => navigate('info-how-to-sell')} className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Узнать подробнее
            </button>
          </div>
          <div className="flex justify-center gap-10 mt-10">
            {[['0 ₽', 'Регистрация'], ['15%', 'Комиссия'], ['7 дней', 'Вывод средств']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-sm text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
