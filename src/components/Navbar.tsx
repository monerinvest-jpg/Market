import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Package, Settings, Store } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar: React.FC = () => {
  const { cartItems, favorites, user, isLoggedIn, logout, navigate, setSearchQuery, openAuthModal } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    navigate('catalog');
  };

  const getDashboardPage = () => {
    if (!user) return 'home';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'seller') return 'seller-dashboard';
    return 'buyer-profile';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🧶</span>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              Hand<span className="text-amber-500">Made</span>
            </span>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Найти товар, магазин..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50"
              />
            </div>
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate('catalog')} className="px-3 py-2 text-sm text-gray-600 hover:text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors">
              Каталог
            </button>
            <button onClick={() => navigate('info-how-to-sell')} className="px-3 py-2 text-sm text-gray-600 hover:text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors">
              Продавать
            </button>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 ml-auto">
            {isLoggedIn && (
              <button onClick={() => navigate('buyer-favorites')} className="relative p-2 text-gray-600 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {favorites.length}
                  </span>
                )}
              </button>
            )}

            <button onClick={() => navigate('cart')} className="relative p-2 text-gray-600 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-colors">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartItems.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                      <div className="text-xs mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user?.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user?.role === 'admin' ? '👑 Администратор' : user?.role === 'seller' ? '🏪 Продавец' : '🛍️ Покупатель'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => { navigate(getDashboardPage() as any); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Личный кабинет
                    </button>
                    <button onClick={() => { navigate('buyer-orders'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={15} /> Мои заказы
                    </button>
                    {user?.role === 'seller' && (
                      <button onClick={() => { navigate('seller-dashboard'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Store size={15} /> Панель продавца
                      </button>
                    )}
                    {user?.role === 'admin' && (
                      <button onClick={() => { navigate('admin-dashboard'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings size={15} /> Администрирование
                      </button>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={15} /> Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Войти
              </button>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
            <button onClick={() => { navigate('catalog'); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">🛍️ Каталог</button>
            <button onClick={() => { navigate('info-how-to-sell'); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">🏪 Продавать</button>
            <button onClick={() => { navigate('info-how-to-buy'); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">❓ Как купить</button>
            <button onClick={() => { navigate('info-faq'); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">💬 FAQ</button>
          </div>
        )}
      </div>
    </header>
  );
};
