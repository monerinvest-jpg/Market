import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, navigate, isLoggedIn, openAuthModal, placeOrder, showNotification, appliedPromo, applyPromo, removePromo } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [address, setAddress] = useState('г. Москва, ул. Ленина, д. 10, кв. 5');
  const [deliveryMethod, setDeliveryMethod] = useState('СДЭК');
  const [paymentMethod, setPaymentMethod] = useState('Банковская карта');

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryCost = appliedPromo?.type === 'free_delivery' ? 0 : 350;
  const discount = appliedPromo?.discount || 0;
  const total = subtotal + deliveryCost - (appliedPromo?.type !== 'free_delivery' ? discount : 0);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    applyPromo(promoCode.trim(), subtotal);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) { openAuthModal('login'); return; }
    if (step === 'cart') { setStep('checkout'); return; }
    placeOrder(address, deliveryMethod, paymentMethod);
  };

  const groupedByShop = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    const key = item.product.shopId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0 && step === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
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
        {step === 'cart' ? `Корзина (${cartItems.length})` : 'Оформление заказа'}
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {['Корзина', 'Оформление', 'Оплата'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-medium ${(i === 0 && step === 'cart') || (i === 1 && step === 'checkout') ? 'text-amber-600' : i < (step === 'checkout' ? 1 : 0) ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${(i === 0 && step === 'cart') || (i === 1 && step === 'checkout') ? 'bg-amber-500 text-white' : i < (step === 'checkout' ? 1 : 0) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
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
                  <span>🏪</span>
                  <span className="font-semibold text-gray-900">{items[0].product.shopName}</span>
                </div>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer"
                        onClick={() => navigate('product', { productId: item.productId })}
                      />
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate('product', { productId: item.productId })} className="text-sm font-medium text-gray-900 hover:text-amber-700 line-clamp-2 text-left">
                          {item.product.name}
                        </button>
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
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Адрес доставки</h3>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  rows={2}
                />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Способ доставки</h3>
                <div className="space-y-2">
                  {['СДЭК', 'Почта России', 'Курьер'].map(m => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 border border-gray-100">
                      <input type="radio" name="delivery" value={m} checked={deliveryMethod === m} onChange={() => setDeliveryMethod(m)} className="text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">{m}</span>
                      <span className="ml-auto text-sm text-gray-500">350 ₽</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4">Способ оплаты</h3>
                <div className="space-y-2">
                  {['Банковская карта', 'СБП', 'ЮMoney'].map(m => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 border border-gray-100">
                      <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} className="text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Итого</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Товары ({cartItems.reduce((s,i) => s + i.quantity, 0)} шт.)</span>
                <span>{subtotal.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>{deliveryCost === 0 ? <span className="text-green-500">Бесплатно</span> : `${deliveryCost} ₽`}</span>
              </div>
              {appliedPromo && appliedPromo.type !== 'free_delivery' && (
                <div className="flex justify-between text-green-600">
                  <span>Скидка ({appliedPromo.code})</span>
                  <span>-{appliedPromo.discount.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base text-gray-900">
                <span>К оплате</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
            </div>

            {/* Promo */}
            {!appliedPromo ? (
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Промокод"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <button onClick={handleApplyPromo} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                  Применить
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
                <span className="text-sm text-green-700 font-medium">✅ {appliedPromo.code}</span>
                <button onClick={removePromo} className="text-xs text-gray-500 hover:text-red-500">Убрать</button>
              </div>
            )}

            <div className="text-xs text-gray-400 mb-4">Попробуйте: CRAFT10, WELCOME500, FREEDEL</div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {step === 'cart' ? 'Оформить заказ' : 'Подтвердить и оплатить'}
              <ArrowRight size={16} />
            </button>

            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700">
                ← Назад к корзине
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
