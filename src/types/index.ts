export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin' | 'moderator' | 'finance_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  city?: string;
  bonusBalance: number;
  referralCode: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId?: string;
  productCount: number;
  children?: Category[];
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  categoryId: string;
  tags: string[];
  materials: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  inStock: boolean;
  stockCount: number;
  productionDays: number;
  isDigital: boolean;
  isCustomizable: boolean;
  weight?: number;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'archived';
  createdAt: string;
  isFeatured?: boolean;
  deliveryMethods: string[];
  city: string;
}

export interface Shop {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  city: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  responseTime: string;
  status: 'draft' | 'pending' | 'active' | 'restricted' | 'blocked' | 'rejected';
  createdAt: string;
  deliveryConditions: string;
  returnConditions: string;
  isSubscribed?: boolean;
}

export type OrderStatus =
  | 'new' | 'paid' | 'accepted' | 'manufacturing' | 'ready'
  | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'return' | 'dispute';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAmount: number;
  discountAmount: number;
  deliveryAddress: string;
  deliveryMethod: string;
  trackNumber?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  promoCode?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  shopId: string;
  rating: number;
  text: string;
  photos?: string[];
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  sellerReply?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variant?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved_buyer' | 'resolved_seller' | 'resolved_partial' | 'closed';
  createdAt: string;
  resolvedAt?: string;
}

export interface ReferralReward {
  id: string;
  userId: string;
  amount: number;
  status: 'created' | 'pending_action' | 'pending_order' | 'antifrod' | 'confirmed' | 'paid' | 'rejected' | 'cancelled';
  type: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  orderId?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_delivery';
  value: number;
  minOrderAmount: number;
  usageLimit: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Payout {
  id: string;
  sellerId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
}
