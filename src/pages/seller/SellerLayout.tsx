import React from 'react';
import { useStore, Page } from '../../store/useStore';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, PlusCircle } from 'lucide-react';
import { SellerDashboard } from './SellerDashboard';
import { SellerProducts } from './SellerProducts';
import { SellerOrders } from './SellerOrders';
import { SellerFinances } from './SellerFinances';
import { SellerProductNew } from './SellerProductNew';

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'seller-dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { page: 'seller-products', label: 'Мои товары', icon: Package },
  { page: 'seller-orders', label: 'Заказы', icon: ShoppingBag },
  { page: 'seller-finances', label: 'Финансы', icon: DollarSign },
];

export const SellerLayout: React.FC = () => {
  const { currentPage, navigate, user } = useStore();

  if (!user || user.role !== 'seller') {
    navigate('home');
    return null;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'seller-products': return <SellerProducts />;
      case 'seller-orders': return <SellerOrders />;
      case 'seller-finances': return <SellerFinances />;
      case 'seller-product-new': return <SellerProductNew />;
      default: return <SellerDashboard />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Кабинет продавца</h1>
        <button
          onClick={() => navigate('seller-product-new')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <PlusCircle size={16} /> Добавить товар
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <aside>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold mb-2">
                🏪
              </div>
              <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">Продавец</div>
            </div>
            <nav className="p-2">
              {navItems.map(({ page, label, icon: Icon }) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
