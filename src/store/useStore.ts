import { create } from 'zustand';
import { CartItem, Product, User, Order } from '../types';
import { currentUser, mockOrders } from '../data/mockData';

type Page =
  | 'home' | 'catalog' | 'product' | 'shop' | 'cart' | 'checkout'
  | 'buyer-profile' | 'buyer-orders' | 'buyer-favorites' | 'buyer-messages'
  | 'buyer-bonuses' | 'buyer-referral' | 'buyer-reviews'
  | 'seller-dashboard' | 'seller-products' | 'seller-orders' | 'seller-finances'
  | 'seller-analytics' | 'seller-promotion' | 'seller-referral' | 'seller-onboarding'
  | 'admin-dashboard' | 'admin-users' | 'admin-sellers' | 'admin-products'
  | 'admin-orders' | 'admin-payments' | 'admin-disputes' | 'admin-referral'
  | 'admin-promo' | 'admin-content' | 'admin-settings' | 'admin-categories'
  | 'info-about' | 'info-how-to-buy' | 'info-how-to-sell' | 'info-delivery'
  | 'info-payment' | 'info-returns' | 'info-faq' | 'info-contacts';

interface AppState {
  currentPage: Page;
  selectedProductId: string | null;
  selectedShopId: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  cartItems: CartItem[];
  favorites: string[];
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  orders: Order[];

  navigate: (page: Page, params?: { productId?: string; shopId?: string; categoryId?: string }) => void;
  setSearchQuery: (q: string) => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  login: (role?: 'buyer' | 'seller' | 'admin') => void;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  placeOrder: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedShopId: null,
  selectedCategoryId: null,
  searchQuery: '',
  cartItems: [],
  favorites: ['prod-2', 'prod-4'],
  user: null,
  isLoggedIn: false,
  isAuthModalOpen: false,
  authMode: 'login',
  notification: null,
  orders: mockOrders,

  navigate: (page, params) => set({
    currentPage: page,
    selectedProductId: params?.productId ?? null,
    selectedShopId: params?.shopId ?? null,
    selectedCategoryId: params?.categoryId ?? null,
  }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  addToCart: (product, quantity = 1, variant) => {
    const { cartItems, isLoggedIn, openAuthModal } = get();
    if (!isLoggedIn) { openAuthModal('login'); return; }
    const existing = cartItems.find(i => i.productId === product.id && i.variant === variant);
    if (existing) {
      set({ cartItems: cartItems.map(i => i.productId === product.id && i.variant === variant ? { ...i, quantity: i.quantity + quantity } : i) });
    } else {
      set({ cartItems: [...cartItems, { productId: product.id, product, quantity, variant }] });
    }
    get().showNotification('Товар добавлен в корзину', 'success');
  },

  removeFromCart: (productId) => set(s => ({ cartItems: s.cartItems.filter(i => i.productId !== productId) })),

  updateCartQuantity: (productId, quantity) => set(s => ({
    cartItems: quantity <= 0
      ? s.cartItems.filter(i => i.productId !== productId)
      : s.cartItems.map(i => i.productId === productId ? { ...i, quantity } : i),
  })),

  clearCart: () => set({ cartItems: [] }),

  toggleFavorite: (productId) => {
    const { isLoggedIn, openAuthModal, favorites } = get();
    if (!isLoggedIn) { openAuthModal('login'); return; }
    set({ favorites: favorites.includes(productId) ? favorites.filter(id => id !== productId) : [...favorites, productId] });
  },

  login: (role = 'buyer') => {
    const user: User = { ...currentUser, role };
    set({ isLoggedIn: true, user, isAuthModalOpen: false });
    get().showNotification('Вы успешно вошли в систему', 'success');
  },

  logout: () => set({ isLoggedIn: false, user: null, currentPage: 'home', cartItems: [] }),

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  placeOrder: () => {
    const { cartItems, user, orders } = get();
    if (!cartItems.length || !user) return;
    const newOrder: Order = {
      id: `ord-${Date.now()}`, userId: user.id,
      items: cartItems.map(i => ({
        productId: i.productId, productName: i.product.name,
        productImage: i.product.images[0], shopId: i.product.shopId,
        shopName: i.product.shopName, price: i.product.price,
        quantity: i.quantity, variant: i.variant,
      })),
      status: 'paid',
      totalAmount: cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      deliveryAmount: 300, discountAmount: 0,
      deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      deliveryMethod: 'СДЭК', paymentMethod: 'Банковская карта',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    set({ orders: [newOrder, ...orders], cartItems: [], currentPage: 'buyer-orders' });
    get().showNotification('Заказ успешно оформлен!', 'success');
  },
}));
