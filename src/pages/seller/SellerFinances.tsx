import React from 'react';
import { useStore } from '../../store/useStore';
import { shopAPI, orderAPI } from '../../db/database';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const SellerFinances: React.FC = () => {
  const { user } = useStore();
  const shop = user ? shopAPI.getBySeller(user.id) : undefined;
  const orders = shop ? orderAPI.getByShop(shop.id) : [];

  const completed = orders.filter(o => ['delivered', 'completed'].includes(o.status));
  const pending = orders.filter(o => ['paid', 'accepted', 'manufacturing', 'ready', 'shipped'].includes(o.status));

  const getShopRevenue = (orderList: typeof orders) => orderList.reduce((sum, o) => {
    const items = o.items.filter(i => i.shopId === shop?.id);
    return sum + items.reduce((s, i) => s + i.price * i.quantity, 0);
  }, 0);

  const totalRevenue = getShopRevenue(completed);
  const pendingRevenue = getShopRevenue(pending);
  const commission = Math.round(totalRevenue * 0.07);
  const payout = totalRevenue - commission;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Финансы</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-2xl p-4">
          <CheckCircle size={20} className="text-green-500" />
          <div className="text-xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString()} ₽</div>
          <div className="text-xs text-gray-500">Завершённые заказы</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4">
          <Clock size={20} className="text-orange-500" />
          <div className="text-xl font-bold text-gray-900 mt-2">{pendingRevenue.toLocaleString()} ₽</div>
          <div className="text-xs text-gray-500">Ожидающие</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4">
          <DollarSign size={20} className="text-red-500" />
          <div className="text-xl font-bold text-gray-900 mt-2">{commission.toLocaleString()} ₽</div>
          <div className="text-xs text-gray-500">Комиссия платформы (7%)</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4">
          <TrendingUp size={20} className="text-blue-500" />
          <div className="text-xl font-bold text-gray-900 mt-2">{payout.toLocaleString()} ₽</div>
          <div className="text-xs text-gray-500">К выплате</div>
        </div>
      </div>

      {/* Orders table */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">История заказов</h3>
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl text-gray-500 text-sm">Нет заказов</div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 10).map(order => {
              const amount = order.items.filter(i => i.shopId === shop?.id).reduce((s, i) => s + i.price * i.quantity, 0);
              return (
                <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${['delivered', 'completed'].includes(order.status) ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {['delivered', 'completed'].includes(order.status) ? 'Завершён' : 'Ожидает'}
                  </span>
                  <div className="text-sm font-bold text-gray-900">{amount.toLocaleString()} ₽</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
        <div className="font-semibold text-amber-900 mb-1">Условия выплат</div>
        <ul className="text-amber-700 space-y-0.5 text-xs">
          <li>• Выплаты производятся после подтверждения получения покупателем</li>
          <li>• Комиссия платформы: 7% от суммы продажи</li>
          <li>• Срок поступления средств: 3-5 рабочих дней</li>
          <li>• Минимальная сумма вывода: 1 000 ₽</li>
        </ul>
      </div>
    </div>
  );
};
