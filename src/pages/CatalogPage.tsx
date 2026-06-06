import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { products, categories } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'new', label: 'По новизне' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'rating', label: 'По рейтингу' },
];

export const CatalogPage: React.FC = () => {
  const { selectedCategoryId, searchQuery, navigate } = useStore();
  const [sortBy, setSortBy] = useState('popular');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDigital, setOnlyDigital] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(selectedCategoryId || '');

  const filtered = useMemo(() => {
    let res = [...products];
    if (activeCat) res = res.filter(p => p.categoryId === activeCat);
    if (searchQuery) res = res.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (priceMin) res = res.filter(p => p.price >= Number(priceMin));
    if (priceMax) res = res.filter(p => p.price <= Number(priceMax));
    if (selectedCity) res = res.filter(p => p.city === selectedCity);
    if (onlyInStock) res = res.filter(p => p.inStock);
    if (onlyDigital) res = res.filter(p => p.isDigital);
    switch (sortBy) {
      case 'new': res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'price-asc': res.sort((a, b) => a.price - b.price); break;
      case 'price-desc': res.sort((a, b) => b.price - a.price); break;
      case 'rating': res.sort((a, b) => b.rating - a.rating); break;
      default: res.sort((a, b) => b.salesCount - a.salesCount);
    }
    return res;
  }, [activeCat, searchQuery, priceMin, priceMax, selectedCity, onlyInStock, onlyDigital, sortBy]);

  const cities = [...new Set(products.map(p => p.city))];

  const currentCategory = categories.find(c => c.id === activeCat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={() => navigate('home')} className="hover:text-amber-600">Главная</button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{currentCategory ? currentCategory.name : 'Каталог'}</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Фильтры
            </h3>

            {/* Categories */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Категории</h4>
              <div className="space-y-1">
                <button onClick={() => setActiveCat('')} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!activeCat ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Все категории
                </button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCat(cat.id === activeCat ? '' : cat.id)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${activeCat === cat.id ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Цена, ₽</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="От" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <input type="number" placeholder="До" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>

            {/* City */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Город продавца</h4>
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="">Все города</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} className="w-4 h-4 text-amber-500 rounded" />
                <span className="text-sm text-gray-700">Только в наличии</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyDigital} onChange={e => setOnlyDigital(e.target.checked)} className="w-4 h-4 text-amber-500 rounded" />
                <span className="text-sm text-gray-700">Цифровые товары</span>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setActiveCat(''); setPriceMin(''); setPriceMax(''); setSelectedCity(''); setOnlyInStock(false); setOnlyDigital(false); }}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                <Filter size={16} />
                Фильтры
              </button>
              <span className="text-sm text-gray-500">
                Найдено: <span className="font-medium text-gray-900">{filtered.length}</span> товаров
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-4 mb-4">
              <div className="flex flex-wrap gap-3">
                <select value={activeCat} onChange={e => setActiveCat(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm">
                  <option value="">Все категории</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" placeholder="Цена от" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                <input type="number" placeholder="Цена до" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm">
                  <option value="">Все города</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCat && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {categories.find(c => c.id === activeCat)?.name}
                <button onClick={() => setActiveCat('')}><X size={12} /></button>
              </span>
            )}
            {priceMin && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                От {Number(priceMin).toLocaleString()} ₽
                <button onClick={() => setPriceMin('')}><X size={12} /></button>
              </span>
            )}
            {priceMax && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                До {Number(priceMax).toLocaleString()} ₽
                <button onClick={() => setPriceMax('')}><X size={12} /></button>
              </span>
            )}
            {selectedCity && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity('')}><X size={12} /></button>
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
