import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, Tag, Gift } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, navigate, isLoggedIn, openAuthModal, placeOrder, showNotification } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [useBonuses, setUseBonuses] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState('cdek');

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryCost = cartItems.length > 0 ? 350 : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const bonusDiscount = useBonuses ? Math.min(600, Math.round(subtotal * 0.3)) : 0;
  const total = subtotal + deliveryCost - discount - bonusDiscount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'craft10') {
      setPromoApplied(true);
      showNotification('Промокод применён! Скидка 10%', 'success');
    } else {
      showNotification('Промокод не найден', 'error');
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) { openAuthModal('login'); return; }
    if (step === 'cart') { setStep('checkout'); return; }
    placeOrder();
  };

  // Group by shop
  const groupedByShop = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    const key = item.product.shopId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingCart size={60} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
        <p className="text-gray-500 mb-8">Добавьте товары, которые вам понравились</p>
        <button onClick={() => navigate('catalog')} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold transition-colors">
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {step === 'cart' ? `Корзина (${cartItems.length} товара)` : 'Оформление заказа'}
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {['Корзина', 'Оформление', 'Оплата'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-medium ${i === 0 && step === 'cart' || i === 1 && step === 'checkout' ? 'text-amber-600' : i < (step === 'checkout' ? 1 : 0) ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 && step === 'cart' || i === 1 && step === 'checkout' ? 'bg-amber-500 text-white' : i < (step === 'checkout' ? 1 : 0) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              {s}
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === 'cart' ? (
            Object.entries(groupedByShop).map(([shopId, items]) => (
              <div key={shopId} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <span className="text-lg">🏪</span>
                  <span className="font-semibold text-gray-900">{items[0].product.shopName}</span>
                </div>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer" onClick={() => navigate('product', { productId: item.productId })} />
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate('product', { productId: item.productId })} className="text-sm font-medium text-gray-900 hover:text-amber-700 line-clamp-2 text-left">{item.product.name}</button>
                        {item.variant && <div className="text-xs text-gray-500 mt-0.5">{item.variant}</div>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">−</button>
                            <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">+</button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{(item.product.price * item.quantity).toLocaleString()} ₽</span>
                            <button onClick={() => removeFromCart(item.productId)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* Checkout form */
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Контактные данные</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя и фамилия</label>
                    <input type="text" defaultValue="Иван Петров" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                    <input type="tel" defaultValue="+7 (999) 123-45-67" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" defaultValue="ivan@example.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Адрес доставки</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Город" defaultValue="Москва" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  <input type="text" placeholder="Улица, дом, квартира" defaultValue="ул. Ленина, д. 10, кв. 5" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Способ доставки</h3>
                <div className="space-y-2">
                  {[
                    { id: 'cdek', name: 'СДЭК', desc: 'ПВЗ или курьером', price: '300–500 ₽', days: '2-5 дней' },
                    { id: 'pochta', name: 'Почта России', desc: 'До отделения', price: '200–350 ₽', days: '5-14 дней' },
                    { id: 'yandex', name: 'Яндекс Доставка', desc: 'Курьером до двери', price: '400–600 ₽', days: '1-2 дня' },
                  ].map(method => (
                    <label key={method.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === method.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-200'}`}>
                      <input type="radio" name="delivery" value={method.id} checked={deliveryMethod === method.id} onChange={() => setDeliveryMethod(method.id)} className="text-amber-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.desc} · {method.days}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{method.price}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Способ оплаты</h3>
                <div className="space-y-2">
                  {[
                    { id: 'card', name: 'Банковская карта', icon: '💳' },
                    { id: 'sbp', name: 'СБП (Система быстрых платежей)', icon: '⚡' },
                    { id: 'yoomoney', name: 'ЮMoney', icon: '💰' },
                  ].map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-3 border border-gray-200 hover:border-amber-200 rounded-xl cursor-pointer transition-colors">
                      <input type="radio" name="payment" defaultChecked={method.id === 'card'} className="text-amber-500" />
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-800">{method.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">🔒 Безопасная оплата через ЮKassa</p>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Итого</h3>

            {/* Promo code */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Промокод" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <button onClick={handleApplyPromo} className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl text-sm font-medium transition-colors">
                {promoApplied ? '✓' : 'Применить'}
              </button>
            </div>

            {/* Bonuses */}
            {isLoggedIn && (
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={useBonuses} onChange={e => setUseBonuses(e.target.checked)} className="w-4 h-4 text-amber-500 rounded" />
                <div>
                  <div className="text-sm font-medium text-gray-800 flex items-center gap-1"><Gift size={14} className="text-amber-500" /> Использовать бонусы</div>
                  <div className="text-xs text-gray-500">600 бонусов доступно</div>
                </div>
              </label>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600"><span>Товары ({cartItems.length})</span><span>{subtotal.toLocaleString()} ₽</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Доставка</span><span>{deliveryCost > 0 ? `${deliveryCost.toLocaleString()} ₽` : 'Бесплатно'}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Промокод CRAFT10</span><span>−{discount.toLocaleString()} ₽</span></div>}
              {bonusDiscount > 0 && <div className="flex justify-between text-sm text-amber-600"><span>Бонусы</span><span>−{bonusDiscount.toLocaleString()} ₽</span></div>}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Итого</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-base transition-colors"
            >
              {step === 'cart' ? 'Перейти к оформлению' : 'Оплатить через ЮKassa'}
              <ArrowRight size={18} />
            </button>

            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Назад в корзину
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">Оплачивая, вы соглашаетесь с условиями пользовательского соглашения</p>
          </div>
        </div>
      </div>
    </div>
  );
};
