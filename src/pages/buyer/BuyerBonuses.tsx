import React from 'react';
import { Tag, Star, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';

const promoCodes = [
  { code: 'CRAFT10', desc: 'Скидка 10% на любой заказ', expires: '31.12.2024', type: 'percent' as const },
  { code: 'NEWUSER300', desc: 'Скидка 300 ₽ на первый заказ', expires: '31.03.2024', type: 'fixed' as const },
];

const bonusHistory = [
  { date: '15.02.2024', desc: 'Реферальный бонус', amount: +300, type: 'income' as const },
  { date: '01.03.2024', desc: 'Использован при заказе #ord-001', amount: -150, type: 'expense' as const },
  { date: '10.03.2024', desc: 'Бонус за отзыв', amount: +50, type: 'income' as const },
];

export const BuyerBonuses: React.FC = () => {
  const { user } = useStore();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Бонусы и промокоды</h2>

      {/* Balance */}
      <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-2 opacity-80 text-sm">
          <Star size={16} />
          Бонусный баланс
        </div>
        <div className="text-5xl font-black mb-2">{user?.bonusBalance || 0}</div>
        <div className="text-sm opacity-80">бонусных рублей доступно</div>
        <div className="mt-4 text-xs opacity-70">Можно потратить до 30% от суммы заказа · Срок действия: 90 дней</div>
      </div>

      {/* Promo codes */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tag size={18} className="text-amber-500" />Мои промокоды</h3>
        {promoCodes.length === 0 ? (
          <p className="text-gray-500 text-sm">У вас нет активных промокодов</p>
        ) : (
          <div className="space-y-3">
            {promoCodes.map(promo => (
              <div key={promo.code} className="flex items-center gap-4 p-4 border border-dashed border-amber-300 bg-amber-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-mono font-bold text-amber-700 text-lg">{promo.code}</div>
                  <div className="text-sm text-gray-700">{promo.desc}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={11} />До {promo.expires}</div>
                </div>
                <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors">
                  Копировать
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-amber-500" />История бонусов</h3>
        <div className="space-y-3">
          {bonusHistory.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.desc}</div>
                <div className="text-xs text-gray-500">{item.date}</div>
              </div>
              <span className={`font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                {item.type === 'income' ? '+' : ''}{item.amount} б.
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
