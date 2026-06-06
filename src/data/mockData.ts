import { Category, Product, Shop, Order, Review, User, Dispute, ReferralReward, Message, Payout } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Украшения', slug: 'ukrasheniya', icon: '💍', productCount: 1240, children: [
    { id: '1-1', name: 'Кольца', slug: 'koltsa', icon: '💍', productCount: 320, parentId: '1' },
    { id: '1-2', name: 'Серьги', slug: 'sergi', icon: '✨', productCount: 410, parentId: '1' },
    { id: '1-3', name: 'Браслеты', slug: 'braslety', icon: '📿', productCount: 280, parentId: '1' },
    { id: '1-4', name: 'Подвески', slug: 'podveski', icon: '🔮', productCount: 230, parentId: '1' },
  ]},
  { id: '2', name: 'Одежда', slug: 'odezhda', icon: '👗', productCount: 856 },
  { id: '3', name: 'Предметы интерьера', slug: 'predmety-interyera', icon: '🏺', productCount: 634 },
  { id: '4', name: 'Керамика', slug: 'keramika', icon: '🫙', productCount: 412 },
  { id: '5', name: 'Подарки', slug: 'podarki', icon: '🎁', productCount: 987 },
  { id: '6', name: 'Косметика', slug: 'kosmetika', icon: '🌿', productCount: 324 },
  { id: '7', name: 'Товары для творчества', slug: 'tvorchestvo', icon: '🎨', productCount: 543 },
  { id: '8', name: 'Цифровые товары', slug: 'tsifrovye', icon: '💾', productCount: 289 },
  { id: '9', name: 'Аксессуары', slug: 'aksessuary', icon: '👜', productCount: 678 },
  { id: '10', name: 'Картины и арт', slug: 'kartiny', icon: '🖼️', productCount: 445 },
];

export const shops: Shop[] = [
  {
    id: 'shop-1', sellerId: 'seller-1', name: 'Мастерская Ольги', slug: 'master-olga',
    description: 'Авторские украшения из серебра и натуральных камней. Каждое изделие создаётся вручную с любовью.',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=200&fit=crop',
    city: 'Москва', rating: 4.9, reviewCount: 347, salesCount: 1240,
    responseTime: '~2 часа', status: 'active', createdAt: '2023-03-15',
    deliveryConditions: 'Отправка по всей России. Почта России, СДЭК.',
    returnConditions: 'Возврат в течение 14 дней при сохранении товарного вида.',
  },
  {
    id: 'shop-2', sellerId: 'seller-2', name: 'Глиняный мир', slug: 'glinyaniy-mir',
    description: 'Керамическая посуда и декор ручной работы. Экологичные материалы, уникальные формы.',
    logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop',
    city: 'Санкт-Петербург', rating: 4.8, reviewCount: 215, salesCount: 890,
    responseTime: '~4 часа', status: 'active', createdAt: '2023-06-20',
    deliveryConditions: 'СДЭК, Почта России. Хрупкие изделия упаковываем особо тщательно.',
    returnConditions: 'Возврат в течение 7 дней.',
  },
  {
    id: 'shop-3', sellerId: 'seller-3', name: 'Арт-Студия Весна', slug: 'art-vesna',
    description: 'Картины, постеры и авторские иллюстрации. Оформим ваш интерьер уникальными произведениями.',
    city: 'Екатеринбург', rating: 4.7, reviewCount: 128, salesCount: 560,
    responseTime: '~6 часов', status: 'active', createdAt: '2023-09-10',
    deliveryConditions: 'Отправляем по всей России в специальных тубусах.',
    returnConditions: 'Возврат в течение 14 дней.',
  },
  {
    id: 'shop-4', sellerId: 'seller-4', name: 'Вязаный дом', slug: 'vyazaniy-dom',
    description: 'Вязаные изделия ручной работы: пледы, свитера, игрушки, аксессуары.',
    city: 'Новосибирск', rating: 4.95, reviewCount: 89, salesCount: 340,
    responseTime: '~1 час', status: 'active', createdAt: '2024-01-05',
    deliveryConditions: 'Почта России, СДЭК.',
    returnConditions: 'Возврат в течение 14 дней.',
  },
  {
    id: 'shop-5', sellerId: 'seller-5', name: 'ЭкоБьюти', slug: 'ecobeauty',
    description: 'Натуральная косметика ручного производства. Сертифицированные ингредиенты.',
    city: 'Краснодар', rating: 4.6, reviewCount: 203, salesCount: 780,
    responseTime: '~3 часа', status: 'active', createdAt: '2023-11-12',
    deliveryConditions: 'По всей России. Термозащитная упаковка.',
    returnConditions: 'Возврат невозможен по санитарным нормам.',
  },
];

export const products: Product[] = [
  {
    id: 'prod-1', shopId: 'shop-1', shopName: 'Мастерская Ольги', sellerId: 'seller-1',
    name: 'Серебряное кольцо с лунным камнем', slug: 'serebryanoe-koltso-s-lunnym-kamnem-1',
    description: 'Авторское кольцо из серебра 925 пробы с натуральным лунным камнем. Каждое изделие уникально. Размер подбирается индивидуально.',
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
    name: 'Керамическая кружка ручной работы', slug: 'keramicheskaya-kruzhka-1',
    description: 'Кружка из высококачественной керамики. Объём 350 мл. Подходит для горячих напитков. Каждая кружка уникальна благодаря ручной росписи.',
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
    name: 'Акварельный постер «Ботанический сад»', slug: 'akvarel-poster-botanika-1',
    description: 'Авторский постер с ботаническим рисунком. Печать на плотной бумаге 300 г/м². Формат А3.',
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
    id: 'prod-4', shopId: 'shop-4', shopName: 'Вязаный дом', sellerId: 'seller-4',
    name: 'Вязаный плед из мериноса', slug: 'vyazaniy-pled-merinos-1',
    description: 'Тёплый плед из 100% мериносовой шерсти. Размер 130x180 см. Гипоаллергенный материал.',
    price: 8900, oldPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop',
    ],
    category: 'Предметы интерьера', categoryId: '3', tags: ['плед', 'мериносовая шерсть', 'вязание'],
    materials: ['Мериносовая шерсть'], colors: ['Молочный', 'Серый', 'Бежевый'],
    sizes: ['130x180 см'],
    rating: 4.95, reviewCount: 41, salesCount: 178, inStock: true, stockCount: 5,
    productionDays: 14, isDigital: false, isCustomizable: true, weight: 800,
    status: 'active', createdAt: '2024-03-01', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Новосибирск',
  },
  {
    id: 'prod-5', shopId: 'shop-5', shopName: 'ЭкоБьюти', sellerId: 'seller-5',
    name: 'Набор натуральных бомбочек для ванны', slug: 'nabor-bombochek-vanny-1',
    description: 'Набор из 6 бомбочек для ванны с эфирными маслами. Натуральный состав. Подарочная упаковка.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599686102210-0e1d1a180d77?w=600&h=600&fit=crop',
    ],
    category: 'Косметика', categoryId: '6', tags: ['бомбочки', 'ванна', 'подарок', 'натуральная косметика'],
    materials: ['Лимонная кислота', 'Сода', 'Эфирные масла'], colors: ['Разноцветный'],
    sizes: ['Набор 6 шт'],
    rating: 4.6, reviewCount: 87, salesCount: 423, inStock: true, stockCount: 30,
    productionDays: 1, isDigital: false, isCustomizable: true,
    status: 'active', createdAt: '2024-02-14', isFeatured: true,
    deliveryMethods: ['Почта России', 'СДЭК', 'Яндекс Доставка'], city: 'Краснодар',
  },
  {
    id: 'prod-6', shopId: 'shop-1', shopName: 'Мастерская Ольги', sellerId: 'seller-1',
    name: 'Серьги с аметистом "Лаванда"', slug: 'sergi-s-ametistom-lavanda-1',
    description: 'Авторские серьги из серебра с натуральными аметистами. Форма капли.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    ],
    category: 'Украшения', categoryId: '1', tags: ['серьги', 'аметист', 'серебро'],
    materials: ['Серебро 925', 'Аметист'], colors: ['Серебристый', 'Фиолетовый'], sizes: [],
    rating: 4.8, reviewCount: 31, salesCount: 89, inStock: true, stockCount: 12,
    productionDays: 3, isDigital: false, isCustomizable: false, weight: 8,
    status: 'active', createdAt: '2024-02-20', isFeatured: false,
    deliveryMethods: ['Почта России', 'СДЭК'], city: 'Москва',
  },
  {
    id: 'prod-7', shopId: 'shop-2', shopName: 'Глиняный мир', sellerId: 'seller-2',
    name: 'Ваза для цветов «Облако»', slug: 'vaza-oblako-1',
    description: 'Авторская ваза из белой керамики с матовым покрытием. Высота 25 см.',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
    ],
    category: 'Керамика', categoryId: '4', tags: ['ваза', 'керамика', 'интерьер'],
    materials: ['Белая керамика'], colors: ['Белый'], sizes: ['25 см'],
    rating: 4.9, reviewCount: 22, salesCount: 67, inStock: true, stockCount: 7,
    productionDays: 10, isDigital: false, isCustomizable: false, weight: 600,
    status: 'active', createdAt: '2024-03-10', isFeatured: false,
    deliveryMethods: ['СДЭК', 'Почта России'], city: 'Санкт-Петербург',
  },
  {
    id: 'prod-8', shopId: 'shop-3', shopName: 'Арт-Студия Весна', sellerId: 'seller-3',
    name: 'Цифровой шаблон «Ботаника» для печати', slug: 'tsifrovoy-shablon-botanika-1',
    description: 'Набор из 10 ботанических иллюстраций в формате PDF. Готовы к печати формат А4 и А3.',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1531171673193-06cc7b46f3e7?w=600&h=600&fit=crop',
    ],
    category: 'Цифровые товары', categoryId: '8', tags: ['цифровой', 'шаблон', 'ботаника', 'печать'],
    materials: [], colors: [], sizes: ['А3', 'А4'],
    rating: 4.7, reviewCount: 15, salesCount: 234, inStock: true, stockCount: 999,
    productionDays: 0, isDigital: true, isCustomizable: false,
    status: 'active', createdAt: '2024-01-30', isFeatured: false,
    deliveryMethods: ['Цифровая доставка'], city: 'Екатеринбург',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1', userId: 'user-1', userName: 'Анна К.', productId: 'prod-1', shopId: 'shop-1',
    rating: 5, text: 'Прекрасное кольцо! Камень потрясающий, всё сделано очень аккуратно. Продавец быстро ответила на все вопросы.',
    qualityRating: 5, deliveryRating: 5, communicationRating: 5,
    sellerReply: 'Спасибо большое! Очень рада, что украшение понравилось 💕',
    createdAt: '2024-03-01',
  },
  {
    id: 'rev-2', userId: 'user-2', userName: 'Мария Л.', productId: 'prod-2', shopId: 'shop-2',
    rating: 5, text: 'Кружка просто прелесть! Держит тепло хорошо, очень красивая.',
    qualityRating: 5, deliveryRating: 4, communicationRating: 5,
    createdAt: '2024-03-05',
  },
  {
    id: 'rev-3', userId: 'user-3', userName: 'Екатерина В.', productId: 'prod-4', shopId: 'shop-4',
    rating: 5, text: 'Плед просто невероятный! Очень мягкий и тёплый. Буду заказывать ещё.',
    qualityRating: 5, deliveryRating: 5, communicationRating: 5,
    createdAt: '2024-03-10',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-001', userId: 'buyer-1',
    items: [{ productId: 'prod-1', productName: 'Серебряное кольцо с лунным камнем', productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop', shopId: 'shop-1', shopName: 'Мастерская Ольги', price: 4500, quantity: 1, variant: 'Размер 17' }],
    status: 'delivered', totalAmount: 4500, deliveryAmount: 300, discountAmount: 0,
    deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5', deliveryMethod: 'СДЭК',
    trackNumber: 'CDEK123456789', paymentMethod: 'Банковская карта',
    createdAt: '2024-03-01', updatedAt: '2024-03-07',
  },
  {
    id: 'ord-002', userId: 'buyer-1',
    items: [{ productId: 'prod-5', productName: 'Набор натуральных бомбочек для ванны', productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop', shopId: 'shop-5', shopName: 'ЭкоБьюти', price: 1200, quantity: 2 }],
    status: 'shipped', totalAmount: 2400, deliveryAmount: 250, discountAmount: 0,
    deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5', deliveryMethod: 'Яндекс Доставка',
    trackNumber: 'YD987654321', paymentMethod: 'СБП',
    createdAt: '2024-03-10', updatedAt: '2024-03-12',
  },
  {
    id: 'ord-003', userId: 'buyer-1',
    items: [{ productId: 'prod-4', productName: 'Вязаный плед из мериноса', productImage: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=100&h=100&fit=crop', shopId: 'shop-4', shopName: 'Вязаный дом', price: 8900, quantity: 1, variant: 'Цвет: Молочный' }],
    status: 'manufacturing', totalAmount: 8900, deliveryAmount: 400, discountAmount: 0,
    deliveryAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5', deliveryMethod: 'СДЭК',
    paymentMethod: 'Банковская карта',
    createdAt: '2024-03-15', updatedAt: '2024-03-15',
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'dis-1', orderId: 'ord-001', userId: 'buyer-2', sellerId: 'seller-3',
    reason: 'Товар не соответствует описанию', description: 'Цвет изделия отличается от фото.',
    status: 'in_review', createdAt: '2024-03-08',
  },
];

export const mockReferralRewards: ReferralReward[] = [
  { id: 'ref-1', userId: 'buyer-1', amount: 300, status: 'paid', type: 'buyer_invite_buyer', createdAt: '2024-02-15' },
  { id: 'ref-2', userId: 'buyer-1', amount: 300, status: 'pending_order', type: 'buyer_invite_buyer', createdAt: '2024-03-10' },
];

export const mockMessages: Message[] = [
  { id: 'msg-1', fromId: 'buyer-1', fromName: 'Иван П.', toId: 'seller-1', orderId: 'ord-001', text: 'Здравствуйте! Когда ориентировочно будет отправлено кольцо?', createdAt: '2024-03-02', isRead: true },
  { id: 'msg-2', fromId: 'seller-1', fromName: 'Мастерская Ольги', toId: 'buyer-1', orderId: 'ord-001', text: 'Добрый день! Отправлю в пятницу, трек пришлю сразу после.', createdAt: '2024-03-02', isRead: true },
];

export const mockPayouts: Payout[] = [
  { id: 'pay-1', sellerId: 'seller-1', amount: 23400, commission: 2808, status: 'paid', createdAt: '2024-02-28', paidAt: '2024-03-01' },
  { id: 'pay-2', sellerId: 'seller-1', amount: 12600, commission: 1512, status: 'pending', createdAt: '2024-03-14' },
];

export const currentUser: User = {
  id: 'buyer-1', name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 (999) 123-45-67',
  role: 'buyer', city: 'Москва', bonusBalance: 600, referralCode: 'IVAN300',
  createdAt: '2024-01-01',
};

export const adminStats = {
  gmv: 4850000,
  ordersCount: 2340,
  platformRevenue: 582000,
  newSellers: 47,
  newBuyers: 312,
  moderationQueue: 23,
  activeDisputes: 8,
  pendingPayouts: 890000,
  returns: 34,
  conversion: 3.2,
  avgCheck: 2073,
  repeatPurchases: 38,
};

export const sellerStats = {
  revenue: 87400,
  ordersCount: 43,
  pendingModeration: 2,
  newMessages: 5,
  lowStockProducts: 3,
  shopRating: 4.9,
  pendingPayout: 12600,
  activeDisputes: 0,
};
