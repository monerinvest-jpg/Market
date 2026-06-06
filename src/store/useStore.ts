import { create } from 'zustand';
import { CartItem, Product, User } from '../types';
import { userAPI, orderAPI, promoAPI } from '../db/database';

export type Page =
  | 'home' | 'catalog' | 'product' | 'shop' | 'cart'
  | 'buyer-profile' | 'buyer-orders' | 'buyer-favorites' | 'buyer-messages' | 'buyer-bonuses'
  | 'seller-dashboard' | 'seller-products' | 'seller-orders' | 'seller-finances' | 'seller-product-new'
  | 'admin-dashboard' | 'admin-users' | 'admin-products' | 'admin-orders' | 'admin-shops' | 'admin-promo'
  | 'info-how-to-buy' | 'info-how-to-sell' | 'info-faq';

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
  appliedPromo: { code: string; discount: number; type: string } | null;

  navigate: (page: Page, params?: { productId?: string; shopId?: string; categoryId?: string }) => void;
  setSearchQuery: (q: string) => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  login: (email: string, password: string) => boolean;
  loginAs: (role: 'buyer' | 'seller' | 'admin') => void;
  register: (name: string, email: string, password: string, role: 'buyer' | 'seller') => boolean;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  placeOrder: (address: string, deliveryMethod: string, paymentMethod: string) => void;
  applyPromo: (code: string, subtotal: number) => void;
  removePromo: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedShopId: null,
  selectedCategoryId: null,
  searchQuery: '',
  cartItems: [],
  favorites: [],
  user: null,
  isLoggedIn: false,
  isAuthModalOpen: false,
  authMode: 'login',
  notification: null,
  appliedPromo: null,

  navigate: (page, params) => {
    set({
      currentPage: page,
      selectedProductId: params?.productId ?? null,
      selectedShopId: params?.shopId ?? null,
      selectedCategoryId: params?.categoryId ?? null,
    });
    window.scrollTo(0, 0);
  },

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

  clearCart: () => set({ cartItems: [], appliedPromo: null }),

  toggleFavorite: (productId) => {
    const { isLoggedIn, openAuthModal, favorites } = get();
    if (!isLoggedIn) { openAuthModal('login'); return; }
    set({ favorites: favorites.includes(productId) ? favorites.filter(id => id !== productId) : [...favorites, productId] });
  },

  login: (email, password) => {
    const user = userAPI.login(email, password);
    if (!user) return false;
    if (user.isBlocked) {
      get().showNotification('Ваш аккаунт заблокирован', 'error');
      return false;
    }
    set({ isLoggedIn: true, user, isAuthModalOpen: false });
    get().showNotification(`Добро пожаловать, ${user.name}!`, 'success');
    return true;
  },

  loginAs: (role) => {
    const emails: Record<string, string> = {
      buyer: 'ivan@market.ru',
      seller: 'olga@market.ru',
      admin: 'admin@market.ru',
    };
    const passwords: Record<string, string> = {
      buyer: 'buyer123',
      seller: 'seller123',
      admin: 'admin123',
    };
    const user = userAPI.login(emails[role], passwords[role]);
    if (user) {
      set({ isLoggedIn: true, user, isAuthModalOpen: false });
      get().showNotification(`Вошли как ${role === 'admin' ? 'Администратор' : role === 'seller' ? 'Продавец' : 'Покупатель'}`, 'success');
    }
  },

  register: (name, email, password, role) => {
    const existing = userAPI.getByEmail(email);
    if (existing) {
      get().showNotification('Пользователь с таким email уже существует', 'error');
      return false;
    }
    const user = userAPI.register({ name, email, password, role });
    set({ isLoggedIn: true, user, isAuthModalOpen: false });
    get().showNotification('Регистрация прошла успешно!', 'success');
    return true;
  },

  logout: () => set({ isLoggedIn: false, user: null, currentPage: 'home', cartItems: [], appliedPromo: null }),

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3500);
  },

  placeOrder: (address, deliveryMethod, paymentMethod) => {
    const { cartItems, user, appliedPromo } = get();
    if (!cartItems.length || !user) return;

    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const deliveryAmount = 350;
    const discountAmount = appliedPromo?.discount || 0;
    const total = subtotal + deliveryAmount - discountAmount;

    orderAPI.create({
      userId: user.id,
      items: cartItems.map(i => ({
        productId: i.productId,
        productName: i.product.name,
        productImage: i.product.images[0],
        shopId: i.product.shopId,
        shopName: i.product.shopName,
        price: i.product.price,
        quantity: i.quantity,
        variant: i.variant,
      })),
      status: 'paid',
      totalAmount: total,
      deliveryAmount,
      discountAmount,
      deliveryAddress: address,
      deliveryMethod,
      paymentMethod,
      promoCode: appliedPromo?.code,
    });

    set({ cartItems: [], appliedPromo: null, currentPage: 'buyer-orders' });
    get().showNotification('Заказ успешно оформлен!', 'success');
  },

  applyPromo: (code, subtotal) => {
    const promo = promoAPI.validate(code);
    if (!promo) {
      get().showNotification('Промокод не найден или недействителен', 'error');
      return;
    }
    if (subtotal < promo.minOrderAmount) {
      get().showNotification(`Минимальная сумма заказа для этого промокода: ${promo.minOrderAmount} ₽`, 'error');
      return;
    }
    let discount = 0;
    if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100);
    else if (promo.type === 'fixed') discount = promo.value;
    else if (promo.type === 'free_delivery') discount = 350;

    set({ appliedPromo: { code: promo.code, discount, type: promo.type } });
    get().showNotification(`Промокод применён! Скидка: ${discount} ₽`, 'success');
  },

  removePromo: () => set({ appliedPromo: null }),
}));
