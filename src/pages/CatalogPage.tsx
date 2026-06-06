import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { productAPI, categoryAPI } from '../db/database';
import { ProductCard } from '../components/ProductCard';

export const CatalogPage: React.FC = () => {
  const { searchQuery, selectedCategoryId, navigate } = useStore();
  const products = productAPI.getActive();
  const categories = categoryAPI.getAll();

  const [activeCat, setActiveCat] = useState(selectedCategoryId || '');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (activeCat) {
      list = list.filter(p => p.categoryId === activeCat || p.categoryId.startsWith(activeCat));
    }

    if (priceMin) list = list.filter(p => p.price >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax));
    if (onlyInStock) list = list.filter(p => p.inStock);

    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'new': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: list.sort((a, b) => b.salesCount - a.salesCount);
    }

    return list;
  }, [products, searchQuery, activeCat, priceMin, priceMax, sortBy, onlyInStock]);

  const resetFilters = () => {
    setActiveCat('');
    setPriceMin('');
    setPriceMax('');
    setOnlyInStock(false);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {searchQuery ? `Результаты поиска: «${searchQuery}»` : 'Каталог товаров'}
      </h1>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">Фильтры</span>
              <button onClick={resetFilters} className="text-xs text-amber-600 hover:underline">Сбросить</button>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <div className="text-sm font-semibold text-gray-700 mb-2">Категории</div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                <button
                  onClick={() => setActiveCat('')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!activeCat ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Все категории
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${activeCat === cat.id ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-5">
              <div className="text-sm font-semibold text-gray-700 mb-2">Цена, ₽</div>
              <div className="flex gap-2">
                <input type="number" placeholder="От" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <input type="number" placeholder="До" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} className="w-4 h-4 text-amber-500 rounded" />
                <span className="text-sm text-gray-700">Только в наличии</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
              <SlidersHorizontal size={15} /> Фильтры
            </button>
            <span className="text-sm text-gray-500 flex-1">Найдено: <strong>{filtered.length}</strong> товаров</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="popular">По популярности</option>
              <option value="new">Новинки</option>
              <option value="price_asc">Дешевле</option>
              <option value="price_desc">Дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="lg:hidden bg-white border border-gray-100 rounded-2xl p-4 mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(activeCat === cat.id ? '' : cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeCat === cat.id ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="number" placeholder="Цена от" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                <input type="number" placeholder="Цена до" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                <label className="flex items-center gap-1 text-xs text-gray-700">
                  <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} /> В наличии
                </label>
              </div>
            </div>
          )}

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCat && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                {categories.find(c => c.id === activeCat)?.name}
                <button onClick={() => setActiveCat('')}><X size={12} /></button>
              </span>
            )}
            {priceMin && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                От {Number(priceMin).toLocaleString()} ₽
                <button onClick={() => setPriceMin('')}><X size={12} /></button>
              </span>
            )}
            {priceMax && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                До {Number(priceMax).toLocaleString()} ₽
                <button onClick={() => setPriceMax('')}><X size={12} /></button>
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl">🔍</span>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500 mb-4">Попробуйте изменить фильтры или поисковый запрос</p>
              <button onClick={resetFilters} className="px-6 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
