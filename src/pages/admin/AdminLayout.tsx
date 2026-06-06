import React, { useState } from 'react';
import { useStore, Page } from '../../store/useStore';
import { LayoutDashboard, Users, Package, ShoppingBag, Store, Tag, Settings, ChevronLeft } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminShops } from './AdminShops';
import { AdminPromo } from './AdminPromo';

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'admin-dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { page: 'admin-users', label: 'Пользователи', icon: Users },
  { page: 'admin-shops', label: 'Магазины', icon: Store },
  { page: 'admin-products', label: 'Товары', icon: Package },
  { page: 'admin-orders', label: 'Заказы', icon: ShoppingBag },
  { page: 'admin-promo', label: 'Промокоды', icon: Tag },
];

export const AdminLayout: React.FC = () => {
  const { currentPage, navigate, user } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('home');
    return null;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'admin-users': return <AdminUsers />;
      case 'admin-shops': return <AdminShops />;
      case 'admin-products': return <AdminProducts />;
      case 'admin-orders': return <AdminOrders />;
      case 'admin-promo': return <AdminPromo />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} transition-all duration-200 bg-gray-900 text-white flex flex-col min-h-screen flex-shrink-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <span className="font-bold text-sm">Администратор</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors ml-auto">
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-amber-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && label}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-800">
          <button onClick={() => navigate('home')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings size={16} className="flex-shrink-0" />
            {!collapsed && 'На сайт'}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
