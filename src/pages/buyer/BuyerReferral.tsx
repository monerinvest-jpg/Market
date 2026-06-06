import React from 'react';
import { Copy, Users, Gift, TrendingUp, Share2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockReferralRewards } from '../../data/mockData';

const statusLabels: Record<string, string> = {
  created: 'Создано', pending_action: 'Ожидает', pending_order: 'Ожидает заказ',
  antifrod: 'Проверка', confirmed: 'Подтверждено', paid: 'Начислено', rejected: 'Отклонено', cancelled: 'Отменено',
};

export const BuyerReferral: React.FC = () => {
  const { user, showNotification } = useStore();
  const referralLink = `https://craftmarket.ru/ref/${user?.referralCode}`;
  const rewards = mockReferralRewards;
  const totalEarned = rewards.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
  const pendingEarned = rewards.filter(r => r.status !== 'paid' && r.status !== 'rejected').reduce((s, r) => s + r.amount, 0);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showNotification('Ссылка скопирована!', 'success');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Реферальная программа</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: <Users size={20} className="text-blue-500" />, value: '3', label: 'Приглашено' },
          { icon: <Gift size={20} className="text-amber-500" />, value: `${totalEarned} б.`, label: 'Начислено' },
          { icon: <TrendingUp size={20} className="text-emerald-500" />, value: `${pendingEarned} б.`, label: 'В ожидании' },
          { icon: <Share2 size={20} className="text-purple-500" />, value: '2', label: 'Завершили заказ' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Ваша реферальная ссылка</h3>
        <div className="flex gap-2">
          <input type="text" value={referralLink} readOnly className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700" />
          <button onClick={copyLink} className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors">
            <Copy size={16} />
            Копировать
          </button>
        </div>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {['VK', 'Telegram', 'WhatsApp'].map(s => (
            <button key={s} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm text-gray-700 font-medium transition-colors">
              <Share2 size={14} />
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Условия программы</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Поделитесь ссылкой с другом' },
            { step: '2', text: 'Друг регистрируется и получает скидку 300 ₽ на первый заказ от 2000 ₽' },
            { step: '3', text: 'После завершения первого заказа вы получаете 300 бонусных рублей' },
            { step: '4', text: 'Бонусы действуют 90 дней и можно потратить до 30% от суммы следующего заказа' },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{item.step}</div>
              <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">История начислений</h3>
        <div className="space-y-3">
          {rewards.map(reward => (
            <div key={reward.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900">Реферальный бонус</div>
                <div className="text-xs text-gray-500">{new Date(reward.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">+{reward.amount} б.</div>
                <div className={`text-xs font-medium ${reward.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {statusLabels[reward.status] || reward.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
