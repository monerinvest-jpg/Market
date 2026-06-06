/**
 * Простая "база данных" на основе localStorage.
 * Имитирует работу реального бэкенда.
 * В реальном проекте это было бы заменено на API-запросы к серверу (Node.js + PostgreSQL/MongoDB).
 */

import { User, Product, Shop, Order, Review, Category, Message, PromoCode } from '../types';

// Ключи хранилища
const KEYS = {
  USERS: 'hm_users',
  PRODUCTS: 'hm_products',
  SHOPS: 'hm_shops',
  ORDERS: 'hm_orders',
  REVIEWS: 'hm_reviews',
  CATEGORIES: 'hm_categories',
  MESSAGES: 'hm_messages',
  PROMO_CODES: 'hm_promo_codes',
  INITIALIZED: 'hm_initialized',
};

// Утилиты чтения/записи
function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============= SEED DATA (начальные данные) =============

const seedCategories: Category[] = [
  { id: '1', name: 'Украшения', slug: 'ukrasheniya', icon: '💍', productCount: 4, children: [
    { id: '1-1', name: 'Кольца', slug: 'koltsa', icon: '💍', productCount: 1, parentId: '1' },
    { id: '1-2', name: 'Серьги', slug: 'sergi', icon: '✨', productCount: 2, parentId: '1' },
    { id: '1-3', name: 'Браслеты', slug: 'braslety', icon: '📿', productCount: 1, parentId: '1' },
  ]},
  { id: '2', name: 'Одежда', slug: 'odezhda', icon: '👗', productCount: 2 },
  { id: '3', name: 'Предметы интерьера', slug: 'predmety-interyera', icon: '🏺', productCount: 2 },
  { id: '4', name: 'Керамика', slug: 'keramika', icon: '🫙', productCount: 2 },
  { id: '5', name: 'Подарки', slug: 'podarki', icon: '🎁', productCount: 3 },
  { id: '6', name: 'Косметика', slug: 'kosmetika', icon: '🌿', productCount: 2 },
  { id: '7', name: 'Товары для творчества', slug: 'tvorchestvo', icon: '🎨', productCount: 1 },
  { id: '8', name: 'Цифровые товары', slug: 'tsifrovye', icon: '💾', productCount: 1 },
  { id: '9', name: 'Аксессуары', slug: 'aksessuary', icon: '👜', productCount: 2 },
  { id: '10', name: 'Картины и арт', slug: 'kartiny', icon: '🖼️', productCount: 2 },
];

const seedUsers: User[] = [
  {
    id: 'admin-1', name: 'Администратор', email: 'admin@market.ru', password: 'admin123',
    role: 'admin', bonusBalance: 0, referralCode: 'ADMIN001', createdAt: '2023-01-01',
    city: 'Москва',
  },
  {
    id: 'seller-1', name: 'Ольга Мастерова', email: 'olga@market.ru', password: 'seller123',
    role: 'seller', bonusBalance: 500, referralCode: 'OLGA001', createdAt: '2023-03-15',
    city: 'Москва', phone: '+7 (916) 123-45-67',
  },
  {
    id: 'seller-2', name: 'Михаил Гончаров', email: 'misha@market.ru', password: 'seller123',
    role: 'seller', bonusBalance: 300, referralCode: 'MISH001', createdAt: '2023-06-20',
    city: 'Санкт-Петербург', phone: '+7 (921) 234-56-78',
  },
  {
    id: 'seller-3', name: 'Анна Весенняя', email: 'anna@market.ru', password: 'seller123',
    role: 'seller', bonusBalance: 150, referralCode: 'ANNA001', createdAt: '2023-09-10',
    city: 'Екатеринбург',
  },
  {
    id: 'buyer-1', name: 'Иван Петров', email: 'ivan@market.ru', password: 'buyer123',
    role: 'buyer', bonusBalance: 600, referralCode: 'IVAN001', createdAt: '2023-05-10',
    city: 'Москва', phone: '+7 (999) 123-45-67',
  },
  {
    id: 'buyer-2', name: 'Мария Сидорова', email: 'maria@market.ru', password: 'buyer123',
    role: 'buyer', bonusBalance: 200, referralCode: 'MARI001', createdAt: '2023-08-22',
    city: 'Казань',
  },
];

const seedShops: Shop[] = [
  {
    id: 'shop-1', sellerId: 'seller-1', name: 'Мастерская Ольги', slug: 'master-olga',
    description: 'Авторские украшения из серебра и натуральных камней. Каждое изделие создаётся вручную с любовью.',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=200&fit=crop',
    city: 'Москва', rating: 4.9, reviewCount: 47, salesCount: 124,
    responseTime: '~2 часа', status: 'active', createdAt: '2023-03-15',
    deliveryConditions: 'Отправка по всей России. Почта России, СДЭК.',
    returnConditions: 'Возврат в течение 14 дней при сохранении товарного вида.',
  },
  {
    id: 'shop-2', sellerId: 'seller-2', name: 'Глиняный мир', slug: 'glinyaniy-mir',
    description: 'Керамическая посуда и декор ручной работы. Экологичные материалы, уникальные формы.',
    logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop',
    city: 'Санкт-Петербург', rating: 4.8, reviewCount: 63, salesCount: 287,
    responseTime: '~4 часа', status: 'active', createdAt: '2023-06-20',
    deliveryConditions: 'СДЭК, Почта России. Хрупкие изделия упаковываем особо тщательно.',
    returnConditions: 'Возврат в течение 7 дней.',
  },
  {
    id: 'shop-3', sellerId: 'seller-3', name: 'Арт-Студия Весна', slug: 'art-vesna',
    description: 'Картины, постеры и авторские иллюстрации. Оформим ваш интерьер уникальными произведениями.',
    city: 'Екатеринбург', rating: 4.7, reviewCount: 29, salesCount: 145,
    responseTime: '~6 часов', status: 'active', createdAt: '2023-09-10',
    deliveryConditions: 'Отправляем по всей России в специальных тубусах.',
    returnConditions: 'Возврат в течение 14 дней.',
  },
];

const seedProducts: Product[] = [
  {
    id: 'prod-1', shopId: 'shop-1', shopName: 'Мастерская Ольги', sellerId: 'seller-1',
    name: 'Серебряное кольцо с лунным камнем', slug: 'serebryanoe-koltso-lunnyy-kamen',
    description: 'Авторское кольцо из серебра 925 пробы с натуральным лунным камнем. Каждое изделие уникально. Размер подбирается индивидуально. Камень обладает нежным перламутровым блеском.',
    price: 4500, oldPrice: 5500,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop',
    ],
    category: 'Украшения', categoryId: '1', tags: ['серебро', 'лунный камень', 'кольцо'],
    materials: ['Серебро 925'], colors: ['Серебристый'], sizes: ['15', '16', '17', '18', '19'],
    rating: 4.9, reviewCount: 47, salesCount: 124, inStock: true, stockCount: 8,
    productionDays: 3, isDigital: false, isCustomizable: true, weight: 5,
    status: 'active', createdAt: '2024-01-10', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Москва',
  },
  {
    id: 'prod-2', shopId: 'shop-2', shopName: 'Глиняный мир', sellerId: 'seller-2',
    name: 'Керамическая кружка ручной работы', slug: 'keramicheskaya-kruzhka',
    description: 'Кружка из высококачественной керамики. Объём 350 мл. Подходит для горячих напитков. Каждая кружка уникальна благодаря ручной росписи. Покрыта безопасной пищевой глазурью.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&h=600&fit=crop',
    ],
    category: 'Керамика', categoryId: '4', tags: ['керамика', 'кружка', 'посуда'],
    materials: ['Керамика'], colors: ['Белый', 'Синий', 'Терракотовый'], sizes: ['350 мл'],
    rating: 4.8, reviewCount: 63, salesCount: 287, inStock: true, stockCount: 15,
    productionDays: 7, isDigital: false, isCustomizable: false, weight: 300,
    status: 'active', createdAt: '2024-02-05', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Санкт-Петербург',
  },
  {
    id: 'prod-3', shopId: 'shop-3', shopName: 'Арт-Студия Весна', sellerId: 'seller-3',
    name: 'Акварельный постер «Ботанический сад»', slug: 'akvarel-poster-botanika',
    description: 'Авторский постер с ботаническим рисунком. Печать на плотной бумаге 300 г/м². Формат А3. Яркие стойкие чернила. Отлично впишется в любой интерьер.',
    price: 2200,
    images: [
      'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
    ],
    category: 'Картины и арт', categoryId: '10', tags: ['постер', 'акварель', 'ботаника'],
    materials: ['Бумага 300 г/м²'], colors: ['Зелёный', 'Бежевый'], sizes: ['А3', 'А4'],
    rating: 4.7, reviewCount: 29, salesCount: 145, inStock: true, stockCount: 50,
    productionDays: 2, isDigital: false, isCustomizable: false,
    status: 'active', createdAt: '2024-01-20', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Екатеринбург',
  },
  {
    id: 'prod-4', shopId: 'shop-1', shopName: 'Мастерская Ольги', sellerId: 'seller-1',
    name: 'Серьги с аметистом в серебре', slug: 'sergi-ametist-serebro',
    description: 'Элегантные серьги из серебра 925 пробы с натуральными аметистами. Длина 3 см. Замок — французский крючок. Подходят как для повседневной носки, так и для особых случаев.',
    price: 3200, oldPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9519f94815c0?w=600&h=600&fit=crop',
    ],
    category: 'Украшения', categoryId: '1', tags: ['серьги', 'аметист', 'серебро'],
    materials: ['Серебро 925', 'Аметист'], colors: ['Серебристый', 'Фиолетовый'], sizes: ['Один размер'],
    rating: 4.8, reviewCount: 31, salesCount: 89, inStock: true, stockCount: 12,
    productionDays: 2, isDigital: false, isCustomizable: true, weight: 4,
    status: 'active', createdAt: '2024-02-15', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Москва',
  },
  {
    id: 'prod-5', shopId: 'shop-2', shopName: 'Глиняный мир', sellerId: 'seller-2',
    name: 'Глиняный горшок для суккулентов', slug: 'glinyanyy-gorshok-sukkulenty',
    description: 'Горшок для суккулентов из натуральной глины с дренажным отверстием. Диаметр 10 см. Каждый горшок вручную расписан уникальным орнаментом. Экологически чистый материал.',
    price: 890,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
    ],
    category: 'Керамика', categoryId: '4', tags: ['горшок', 'суккулент', 'глина'],
    materials: ['Глина'], colors: ['Терракотовый', 'Бежевый'], sizes: ['10 см', '12 см', '15 см'],
    rating: 4.6, reviewCount: 18, salesCount: 67, inStock: true, stockCount: 25,
    productionDays: 5, isDigital: false, isCustomizable: false, weight: 200,
    status: 'active', createdAt: '2024-03-01', isFeatured: false,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Санкт-Петербург',
  },
  {
    id: 'prod-6', shopId: 'shop-3', shopName: 'Арт-Студия Весна', sellerId: 'seller-3',
    name: 'Набор открыток «Времена года»', slug: 'nabor-otkrytok-vremena-goda',
    description: 'Набор из 12 авторских открыток с иллюстрациями времён года. Плотная мелованная бумага 350 г/м². Размер 10×15 см. Отличный подарок для любителей красивой почты.',
    price: 650,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop',
    ],
    category: 'Подарки', categoryId: '5', tags: ['открытки', 'иллюстрации', 'подарок'],
    materials: ['Бумага 350 г/м²'], colors: ['Разноцветный'], sizes: ['10x15 см'],
    rating: 4.9, reviewCount: 42, salesCount: 213, inStock: true, stockCount: 100,
    productionDays: 1, isDigital: false, isCustomizable: false, weight: 100,
    status: 'active', createdAt: '2024-01-05', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Екатеринбург',
  },
  {
    id: 'prod-7', shopId: 'shop-1', shopName: 'Мастерская Ольги', sellerId: 'seller-1',
    name: 'Браслет из натуральных камней', slug: 'braslet-naturalnye-kamni',
    description: 'Браслет из натуральных полудрагоценных камней: розовый кварц, горный хрусталь, лабрадорит. На резинке. Подходит на запястье обхватом 15–18 см.',
    price: 2100,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94815c0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    ],
    category: 'Украшения', categoryId: '1', tags: ['браслет', 'камни', 'кварц'],
    materials: ['Розовый кварц', 'Горный хрусталь', 'Лабрадорит'], colors: ['Розовый', 'Белый', 'Серый'], sizes: ['15-18 см'],
    rating: 4.7, reviewCount: 25, salesCount: 78, inStock: true, stockCount: 10,
    productionDays: 2, isDigital: false, isCustomizable: true, weight: 30,
    status: 'active', createdAt: '2024-02-20', isFeatured: false,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Москва',
  },
  {
    id: 'prod-8', shopId: 'shop-2', shopName: 'Глиняный мир', sellerId: 'seller-2',
    name: 'Тарелка «Морской бриз»', slug: 'tarelka-morskoy-briz',
    description: 'Большая обеденная тарелка из белой керамики с авторской росписью в морском стиле. Диаметр 26 см. Пищевая глазурь, можно мыть в посудомоечной машине.',
    price: 2400,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    ],
    category: 'Керамика', categoryId: '4', tags: ['тарелка', 'керамика', 'морской'],
    materials: ['Белая керамика'], colors: ['Белый', 'Синий'], sizes: ['26 см'],
    rating: 4.9, reviewCount: 15, salesCount: 43, inStock: true, stockCount: 7,
    productionDays: 10, isDigital: false, isCustomizable: false, weight: 400,
    status: 'active', createdAt: '2024-03-10', isFeatured: false,
    deliveryMethods: ['СДЭК'], city: 'Санкт-Петербург',
  },
];

const seedOrders: Order[] = [
  {
    id: 'ord-001', userId: 'buyer-1',
    items: [{ productId: 'prod-1', productName: 'Серебряное кольцо с лунным камнем', productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', shopId: 'shop-1', shopName: 'Мастерская Ольги', price: 4500, quantity: 1, variant: 'Размер 17' }],
    status: 'delivered', totalAmount: 4850, deliveryAmount: 350, discountAmount: 0,
    deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5', deliveryMethod: 'СДЭК',
    paymentMethod: 'Банковская карта', createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-05T14:00:00Z',
    trackNumber: 'СДЭК-123456789',
  },
  {
    id: 'ord-002', userId: 'buyer-1',
    items: [
      { productId: 'prod-2', productName: 'Керамическая кружка ручной работы', productImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop', shopId: 'shop-2', shopName: 'Глиняный мир', price: 1800, quantity: 2, variant: 'Синий' },
      { productId: 'prod-6', productName: 'Набор открыток «Времена года»', productImage: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=600&fit=crop', shopId: 'shop-3', shopName: 'Арт-Студия Весна', price: 650, quantity: 1 },
    ],
    status: 'shipped', totalAmount: 4600, deliveryAmount: 350, discountAmount: 0,
    deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5', deliveryMethod: 'Почта России',
    paymentMethod: 'СБП', createdAt: '2024-03-15T12:00:00Z', updatedAt: '2024-03-17T09:00:00Z',
    trackNumber: 'РО123456789РУ',
  },
  {
    id: 'ord-003', userId: 'buyer-2',
    items: [{ productId: 'prod-4', productName: 'Серьги с аметистом в серебре', productImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop', shopId: 'shop-1', shopName: 'Мастерская Ольги', price: 3200, quantity: 1 }],
    status: 'paid', totalAmount: 3550, deliveryAmount: 350, discountAmount: 0,
    deliveryAddress: 'г. Казань, ул. Баумана, д. 5, кв. 12', deliveryMethod: 'СДЭК',
    paymentMethod: 'Банковская карта', createdAt: '2024-03-20T16:00:00Z', updatedAt: '2024-03-20T16:05:00Z',
  },
];

const seedReviews: Review[] = [
  {
    id: 'rev-1', userId: 'buyer-1', userName: 'Иван П.', productId: 'prod-1', shopId: 'shop-1',
    rating: 5, text: 'Великолепное кольцо! Жена в восторге. Камень очень красивый, серебро качественное. Упаковка тоже на высоте.',
    qualityRating: 5, deliveryRating: 5, communicationRating: 5,
    createdAt: '2024-03-06T10:00:00Z',
    sellerReply: 'Большое спасибо! Рады, что украшение понравилось 💍',
  },
  {
    id: 'rev-2', userId: 'buyer-2', userName: 'Мария С.', productId: 'prod-2', shopId: 'shop-2',
    rating: 5, text: 'Кружка просто чудо! Очень удобная, роспись уникальная. Быстро доставили, хорошо упаковали.',
    qualityRating: 5, deliveryRating: 4, communicationRating: 5,
    createdAt: '2024-02-28T14:00:00Z',
  },
  {
    id: 'rev-3', userId: 'buyer-1', userName: 'Иван П.', productId: 'prod-6', shopId: 'shop-3',
    rating: 5, text: 'Открытки потрясающие! Качество печати отличное, иллюстрации очень красивые. Буду заказывать ещё.',
    qualityRating: 5, deliveryRating: 5, communicationRating: 5,
    createdAt: '2024-03-18T09:00:00Z',
  },
];

const seedPromoCodes: PromoCode[] = [
  {
    id: 'promo-1', code: 'CRAFT10', type: 'percent', value: 10,
    minOrderAmount: 1000, usageLimit: 100, usageCount: 23,
    expiresAt: '2025-12-31', isActive: true,
  },
  {
    id: 'promo-2', code: 'WELCOME500', type: 'fixed', value: 500,
    minOrderAmount: 2000, usageLimit: 50, usageCount: 12,
    expiresAt: '2025-06-30', isActive: true,
  },
  {
    id: 'promo-3', code: 'FREEDEL', type: 'free_delivery', value: 0,
    minOrderAmount: 3000, usageLimit: 200, usageCount: 87,
    expiresAt: '2025-12-31', isActive: true,
  },
];

// ============= ИНИЦИАЛИЗАЦИЯ БД =============

export function initializeDatabase(): void {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  write(KEYS.CATEGORIES, seedCategories);
  write(KEYS.USERS, seedUsers);
  write(KEYS.SHOPS, seedShops);
  write(KEYS.PRODUCTS, seedProducts);
  write(KEYS.ORDERS, seedOrders);
  write(KEYS.REVIEWS, seedReviews);
  write(KEYS.MESSAGES, []);
  write(KEYS.PROMO_CODES, seedPromoCodes);

  localStorage.setItem(KEYS.INITIALIZED, 'true');
}

// ============= API-методы (имитация бэкенда) =============

// --- USERS ---
export const userAPI = {
  getAll: (): User[] => read<User>(KEYS.USERS),
  getById: (id: string): User | undefined => read<User>(KEYS.USERS).find(u => u.id === id),
  getByEmail: (email: string): User | undefined => read<User>(KEYS.USERS).find(u => u.email === email),
  login: (email: string, password: string): User | null => {
    const user = read<User>(KEYS.USERS).find(u => u.email === email && u.password === password);
    return user || null;
  },
  register: (data: Omit<User, 'id' | 'bonusBalance' | 'referralCode' | 'createdAt'>): User => {
    const users = read<User>(KEYS.USERS);
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      bonusBalance: 100,
      referralCode: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  update: (id: string, data: Partial<User>): User | null => {
    const users = read<User>(KEYS.USERS);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    write(KEYS.USERS, users);
    return users[idx];
  },
  block: (id: string): void => {
    const users = read<User>(KEYS.USERS);
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) { users[idx].isBlocked = !users[idx].isBlocked; write(KEYS.USERS, users); }
  },
  delete: (id: string): void => {
    write(KEYS.USERS, read<User>(KEYS.USERS).filter(u => u.id !== id));
  },
};

// --- PRODUCTS ---
export const productAPI = {
  getAll: (): Product[] => read<Product>(KEYS.PRODUCTS),
  getById: (id: string): Product | undefined => read<Product>(KEYS.PRODUCTS).find(p => p.id === id),
  getByShop: (shopId: string): Product[] => read<Product>(KEYS.PRODUCTS).filter(p => p.shopId === shopId),
  getActive: (): Product[] => read<Product>(KEYS.PRODUCTS).filter(p => p.status === 'active'),
  getFeatured: (): Product[] => read<Product>(KEYS.PRODUCTS).filter(p => p.isFeatured && p.status === 'active'),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'salesCount'>): Product => {
    const products = read<Product>(KEYS.PRODUCTS);
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.PRODUCTS, [...products, newProduct]);
    return newProduct;
  },
  update: (id: string, data: Partial<Product>): Product | null => {
    const products = read<Product>(KEYS.PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data };
    write(KEYS.PRODUCTS, products);
    return products[idx];
  },
  delete: (id: string): void => {
    write(KEYS.PRODUCTS, read<Product>(KEYS.PRODUCTS).filter(p => p.id !== id));
  },
  approve: (id: string): void => {
    const products = read<Product>(KEYS.PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) { products[idx].status = 'active'; write(KEYS.PRODUCTS, products); }
  },
  reject: (id: string): void => {
    const products = read<Product>(KEYS.PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) { products[idx].status = 'rejected'; write(KEYS.PRODUCTS, products); }
  },
};

// --- SHOPS ---
export const shopAPI = {
  getAll: (): Shop[] => read<Shop>(KEYS.SHOPS),
  getById: (id: string): Shop | undefined => read<Shop>(KEYS.SHOPS).find(s => s.id === id),
  getBySeller: (sellerId: string): Shop | undefined => read<Shop>(KEYS.SHOPS).find(s => s.sellerId === sellerId),
  getActive: (): Shop[] => read<Shop>(KEYS.SHOPS).filter(s => s.status === 'active'),
  create: (data: Omit<Shop, 'id' | 'rating' | 'reviewCount' | 'salesCount' | 'createdAt'>): Shop => {
    const shops = read<Shop>(KEYS.SHOPS);
    const newShop: Shop = {
      ...data,
      id: `shop-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.SHOPS, [...shops, newShop]);
    return newShop;
  },
  update: (id: string, data: Partial<Shop>): Shop | null => {
    const shops = read<Shop>(KEYS.SHOPS);
    const idx = shops.findIndex(s => s.id === id);
    if (idx === -1) return null;
    shops[idx] = { ...shops[idx], ...data };
    write(KEYS.SHOPS, shops);
    return shops[idx];
  },
  approve: (id: string): void => {
    const shops = read<Shop>(KEYS.SHOPS);
    const idx = shops.findIndex(s => s.id === id);
    if (idx !== -1) { shops[idx].status = 'active'; write(KEYS.SHOPS, shops); }
  },
  block: (id: string): void => {
    const shops = read<Shop>(KEYS.SHOPS);
    const idx = shops.findIndex(s => s.id === id);
    if (idx !== -1) { shops[idx].status = shops[idx].status === 'blocked' ? 'active' : 'blocked'; write(KEYS.SHOPS, shops); }
  },
};

// --- ORDERS ---
export const orderAPI = {
  getAll: (): Order[] => read<Order>(KEYS.ORDERS),
  getById: (id: string): Order | undefined => read<Order>(KEYS.ORDERS).find(o => o.id === id),
  getByUser: (userId: string): Order[] => read<Order>(KEYS.ORDERS).filter(o => o.userId === userId),
  getByShop: (shopId: string): Order[] => read<Order>(KEYS.ORDERS).filter(o => o.items.some(i => i.shopId === shopId)),
  create: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const orders = read<Order>(KEYS.ORDERS);
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    write(KEYS.ORDERS, [...orders, newOrder]);
    return newOrder;
  },
  updateStatus: (id: string, status: Order['status']): void => {
    const orders = read<Order>(KEYS.ORDERS);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) { orders[idx].status = status; orders[idx].updatedAt = new Date().toISOString(); write(KEYS.ORDERS, orders); }
  },
};

// --- REVIEWS ---
export const reviewAPI = {
  getAll: (): Review[] => read<Review>(KEYS.REVIEWS),
  getByProduct: (productId: string): Review[] => read<Review>(KEYS.REVIEWS).filter(r => r.productId === productId),
  getByShop: (shopId: string): Review[] => read<Review>(KEYS.REVIEWS).filter(r => r.shopId === shopId),
  create: (data: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = read<Review>(KEYS.REVIEWS);
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.REVIEWS, [...reviews, newReview]);
    return newReview;
  },
  delete: (id: string): void => {
    write(KEYS.REVIEWS, read<Review>(KEYS.REVIEWS).filter(r => r.id !== id));
  },
};

// --- CATEGORIES ---
export const categoryAPI = {
  getAll: (): Category[] => read<Category>(KEYS.CATEGORIES),
  getById: (id: string): Category | undefined => read<Category>(KEYS.CATEGORIES).find(c => c.id === id),
};

// --- MESSAGES ---
export const messageAPI = {
  getAll: (): Message[] => read<Message>(KEYS.MESSAGES),
  getByUser: (userId: string): Message[] => read<Message>(KEYS.MESSAGES).filter(m => m.fromId === userId || m.toId === userId),
  send: (data: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message => {
    const messages = read<Message>(KEYS.MESSAGES);
    const newMsg: Message = {
      ...data,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    write(KEYS.MESSAGES, [...messages, newMsg]);
    return newMsg;
  },
};

// --- PROMO CODES ---
export const promoAPI = {
  getAll: (): PromoCode[] => read<PromoCode>(KEYS.PROMO_CODES),
  validate: (code: string): PromoCode | null => {
    const promo = read<PromoCode>(KEYS.PROMO_CODES).find(p => p.code.toLowerCase() === code.toLowerCase() && p.isActive);
    return promo || null;
  },
  create: (data: Omit<PromoCode, 'id' | 'usageCount'>): PromoCode => {
    const promos = read<PromoCode>(KEYS.PROMO_CODES);
    const newPromo: PromoCode = { ...data, id: `promo-${Date.now()}`, usageCount: 0 };
    write(KEYS.PROMO_CODES, [...promos, newPromo]);
    return newPromo;
  },
  delete: (id: string): void => {
    write(KEYS.PROMO_CODES, read<PromoCode>(KEYS.PROMO_CODES).filter(p => p.id !== id));
  },
  toggle: (id: string): void => {
    const promos = read<PromoCode>(KEYS.PROMO_CODES);
    const idx = promos.findIndex(p => p.id === id);
    if (idx !== -1) { promos[idx].isActive = !promos[idx].isActive; write(KEYS.PROMO_CODES, promos); }
  },
};

// --- STATS ---
export const statsAPI = {
  getDashboard: () => {
    const orders = read<Order>(KEYS.ORDERS);
    const users = read<User>(KEYS.USERS);
    const products = read<Product>(KEYS.PRODUCTS);
    const shops = read<Shop>(KEYS.SHOPS);
    const revenue = orders.filter(o => ['paid', 'delivered', 'completed', 'shipped'].includes(o.status)).reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      totalOrders: orders.length,
      totalUsers: users.filter(u => u.role === 'buyer').length,
      totalSellers: users.filter(u => u.role === 'seller').length,
      totalProducts: products.filter(p => p.status === 'active').length,
      totalShops: shops.filter(s => s.status === 'active').length,
      totalRevenue: revenue,
      newOrders: orders.filter(o => o.status === 'new' || o.status === 'paid').length,
      pendingProducts: products.filter(p => p.status === 'pending').length,
    };
  },
};
