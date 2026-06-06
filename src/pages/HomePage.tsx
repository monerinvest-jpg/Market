import React from 'react';
import { ArrowRight, Star, Shield, Truck, RefreshCw, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { productAPI, shopAPI, categoryAPI } from '../db/database';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { navigate, setSearchQuery } = useStore();
  const [searchVal, setSearchVal] = React.useState('');
  const featured = productAPI.getFeatured();
  const shops = shopAPI.getActive().slice(0, 4);
  const categories = categoryAPI.getAll().slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    navigate('catalog');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <TrendingUp size={14} /> Более 10 000 уникальных товаров
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Найди что-то <span className="text-amber-500">особенное</span><br />
            от российских мастеров
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Украшения, керамика, картины, одежда — всё создано с любовью вручную
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="🔍 Найти товар или мастера..."
              className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm"
            />
            <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold text-sm transition-colors shadow-sm">
              Найти
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {['Украшения', 'Керамика', 'Картины', 'Подарки', 'Косметика'].map(tag => (
              <button
                key={tag}
                onClick={() => { setSearchQuery(tag); navigate('catalog'); }}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
          <button onClick={() => navigate('catalog')} className="text-amber-600 hover:underline text-sm font-medium flex items-center gap-1">
            Все <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('catalog', { categoryId: cat.id })}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Популярные товары</h2>
          <button onClick={() => navigate('catalog')} className="text-amber-600 hover:underline text-sm font-medium flex items-center gap-1">
            Все товары <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Как это работает</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', emoji: '🔍', title: 'Найдите товар', desc: 'Используйте поиск или каталог' },
              { step: '02', emoji: '🛒', title: 'Добавьте в корзину', desc: 'Выберите размер и количество' },
              { step: '03', emoji: '💳', title: 'Оплатите', desc: 'Безопасная оплата картой или СБП' },
              { step: '04', emoji: '📦', title: 'Получите', desc: 'Мастер создаст и отправит заказ' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-5 text-center border border-gray-100">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-xs font-bold text-amber-500 mb-1">Шаг {item.step}</div>
                <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shops */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🏪 Магазины мастеров</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shops.map(shop => (
            <button
              key={shop.id}
              onClick={() => navigate('shop', { shopId: shop.id })}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
            >
              {shop.banner && (
                <div className="w-full h-20 rounded-xl overflow-hidden mb-3">
                  <img src={shop.banner} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.name} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🏪</div>
                )}
                <span className="font-semibold text-gray-900 text-sm">{shop.name}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <span className="text-xs font-semibold text-gray-700">{shop.rating}</span>
                <span className="text-xs text-gray-400">({shop.reviewCount} отзывов)</span>
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">{shop.description}</div>
              <div className="text-xs text-gray-400 mt-2">📍 {shop.city}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-amber-500 py-12 px-4">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Безопасные покупки', desc: 'Деньги хранятся у нас до подтверждения получения' },
            { icon: Truck, title: 'Удобная доставка', desc: 'СДЭК, Почта России по всей стране' },
            { icon: RefreshCw, title: 'Возврат 14 дней', desc: 'Вернём деньги если что-то пойдёт не так' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-lg">{title}</div>
                <div className="text-amber-100 text-sm mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white">
          <span className="text-4xl">🎨</span>
          <h2 className="text-3xl font-bold mt-4 mb-3">Вы мастер?</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Продавайте свои изделия тысячам покупателей. Откройте магазин бесплатно и начните зарабатывать.
          </p>
          <button onClick={() => navigate('info-how-to-sell')} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-semibold transition-colors inline-flex items-center gap-2">
            Открыть магазин <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
