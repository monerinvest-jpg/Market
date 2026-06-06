import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { initializeDatabase } from './db/database';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { BuyerLayout } from './pages/buyer/BuyerLayout';
import { SellerLayout } from './pages/seller/SellerLayout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { HowToBuyPage, HowToSellPage, FAQPage } from './pages/InfoPages';

// Footer
const Footer: React.FC = () => {
  const { navigate } = useStore();
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🧶</span>
              <span className="font-bold text-white">HandMade Market</span>
            </div>
            <p className="text-xs leading-relaxed">Маркетплейс уникальных изделий ручной работы от российских мастеров.</p>
          </div>
          <div>
            <div className="font-semibold text-white text-sm mb-2">Покупателям</div>
            <ul className="space-y-1 text-xs">
              <li><button onClick={() => navigate('info-how-to-buy')} className="hover:text-white transition-colors">Как сделать заказ</button></li>
              <li><button onClick={() => navigate('catalog')} className="hover:text-white transition-colors">Каталог товаров</button></li>
              <li><button onClick={() => navigate('info-faq')} className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white text-sm mb-2">Продавцам</div>
            <ul className="space-y-1 text-xs">
              <li><button onClick={() => navigate('info-how-to-sell')} className="hover:text-white transition-colors">Как начать продавать</button></li>
              <li><button onClick={() => navigate('seller-dashboard')} className="hover:text-white transition-colors">Кабинет продавца</button></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white text-sm mb-2">Контакты</div>
            <ul className="space-y-1 text-xs">
              <li>📧 support@handmade.ru</li>
              <li>📱 +7 (800) 555-35-35</li>
              <li>Пн-Пт 9:00–18:00 МСК</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div>© 2024 HandMade Market. Все права защищены.</div>
          <div className="flex items-center gap-4">
            <span>Политика конфиденциальности</span>
            <span>Оферта</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Notification
const Notification: React.FC = () => {
  const { notification } = useStore();
  if (!notification) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] ${colors[notification.type]} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium max-w-sm animate-slide-up`}>
      <span>{icons[notification.type]}</span>
      <span>{notification.message}</span>
    </div>
  );
};

// Pages that use their own full-height layout (no navbar/footer)
const FULL_PAGE_PAGES = ['admin-dashboard', 'admin-users', 'admin-shops', 'admin-products', 'admin-orders', 'admin-promo'];

const BUYER_PAGES = ['buyer-profile', 'buyer-orders', 'buyer-favorites', 'buyer-bonuses', 'buyer-messages'];
const SELLER_PAGES = ['seller-dashboard', 'seller-products', 'seller-orders', 'seller-finances', 'seller-product-new'];

function AppContent() {
  const { currentPage } = useStore();

  const renderPage = () => {
    if (BUYER_PAGES.includes(currentPage)) return <BuyerLayout />;
    if (SELLER_PAGES.includes(currentPage)) return <SellerLayout />;

    switch (currentPage) {
      case 'catalog': return <CatalogPage />;
      case 'product': return <ProductPage />;
      case 'shop': return <ShopPage />;
      case 'cart': return <CartPage />;
      case 'info-how-to-buy': return <HowToBuyPage />;
      case 'info-how-to-sell': return <HowToSellPage />;
      case 'info-faq': return <FAQPage />;
      default: return <HomePage />;
    }
  };

  if (FULL_PAGE_PAGES.includes(currentPage)) {
    return (
      <>
        <AdminLayout />
        <Notification />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <AuthModal />
      <Notification />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return <AppContent />;
}
