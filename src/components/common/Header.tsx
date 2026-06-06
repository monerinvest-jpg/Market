import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, Store, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { categories } from '../../data/mockData';

export const Header: React.FC = () => {
  const { navigate, cartItems, favorites, isLoggedIn, user, logout, openAuthModal, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('catalog');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">CraftMarket</span>
          </button>

          {/* Catalog button */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center gap-1 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-medium text-sm transition-colors"
            >
              <Menu size={16} />
              Каталог
              <ChevronDown size={14} className={`transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
            </button>
            {catalogOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { navigate('catalog', { categoryId: cat.id }); setCatalogOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50 rounded-lg text-left transition-colors"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.productCount.toLocaleString()} товаров</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск handmade товаров..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Become seller */}
            <button
              onClick={() => isLoggedIn ? navigate('seller-onboarding') : openAuthModal('register')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors border border-amber-200"
            >
              <Store size={15} />
              Продавать
            </button>

            {/* Favorites */}
            <button
              onClick={() => isLoggedIn ? navigate('buyer-favorites') : openAuthModal()}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart size={22} className="text-gray-600" />
              {favorites.length > 0 && isLoggedIn && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={22} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900 text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="text-xs text-amber-600 font-medium mt-1">💰 {user?.bonusBalance} бонусов</div>
                    </div>
                    <div className="p-1.5">
                      {user?.role === 'buyer' && <>
                        <button onClick={() => { navigate('buyer-profile'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Мой профиль</button>
                        <button onClick={() => { navigate('buyer-orders'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Мои заказы</button>
                        <button onClick={() => { navigate('buyer-favorites'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Избранное</button>
                        <button onClick={() => { navigate('buyer-messages'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Сообщения</button>
                        <button onClick={() => { navigate('buyer-bonuses'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Бонусы и промокоды</button>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { navigate('seller-onboarding'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 text-amber-700 rounded-lg font-medium">Стать продавцом</button>
                      </>}
                      {user?.role === 'seller' && <>
                        <button onClick={() => { navigate('seller-dashboard'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Кабинет продавца</button>
                        <button onClick={() => { navigate('seller-products'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Мои товары</button>
                        <button onClick={() => { navigate('seller-orders'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Заказы</button>
                        <button onClick={() => { navigate('seller-finances'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Финансы</button>
                      </>}
                      {(user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'finance_manager') && <>
                        <button onClick={() => { navigate('admin-dashboard'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">Панель администратора</button>
                      </>}
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg">Выйти</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <User size={15} />
                Войти
              </button>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { navigate('catalog', { categoryId: cat.id }); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 rounded-lg text-left"
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside handler */}
      {(catalogOpen || userMenuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setCatalogOpen(false); setUserMenuOpen(false); }} />
      )}
    </header>
  );
};
