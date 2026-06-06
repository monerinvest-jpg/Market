import React from 'react';
import { DollarSign, Clock, CheckCircle, Download, CreditCard } from 'lucide-react';
import { mockPayouts } from '../../data/mockData';
import { sellerStats } from '../../data/mockData';

const payoutStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'text-amber-700 bg-amber-50' },
  processing: { label: 'В обработке', color: 'text-blue-700 bg-blue-50' },
  paid: { label: 'Выплачено', color: 'text-emerald-700 bg-emerald-50' },
  failed: { label: 'Ошибка', color: 'text-red-700 bg-red-50' },
};

export const SellerFinances: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Финансы</h2>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5">
          <div className="text-sm opacity-80 mb-1 flex items-center gap-1"><CheckCircle size={14} />Доступно к выплате</div>
          <div className="text-3xl font-black">{sellerStats.pendingPayout.toLocaleString()} ₽</div>
          <button className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
            Запросить выплату
          </button>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Clock size={14} />Ожидаемые выплаты</div>
          <div className="text-3xl font-bold text-gray-900">8 400 ₽</div>
          <div className="text-xs text-gray-400 mt-2">После завершения заказов</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><DollarSign size={14} />Комиссия платформы</div>
          <div className="text-3xl font-bold text-gray-900">12%</div>
          <div className="text-xs text-gray-400 mt-2">от суммы продаж</div>
        </div>
      </div>

      {/* Payouts history */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">История выплат</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={13} />
            Скачать CSV
          </button>
        </div>
        <div className="space-y-3">
          {mockPayouts.map(payout => {
            const status = payoutStatusConfig[payout.status];
            return (
              <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">Выплата #{payout.id}</div>
                  <div className="text-xs text-gray-500">{new Date(payout.createdAt).toLocaleDateString('ru-RU')}</div>
                  <div className="text-xs text-gray-400">Комиссия: {payout.commission.toLocaleString()} ₽</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900">{payout.amount.toLocaleString()} ₽</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                  {payout.paidAt && <div className="text-xs text-gray-400 mt-0.5">{new Date(payout.paidAt).toLocaleDateString('ru-RU')}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requisites */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-amber-500" />Банковские реквизиты</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Банк</label>
            <input defaultValue="Сбербанк" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">БИК</label>
            <input defaultValue="044525225" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Расчётный счёт</label>
            <input defaultValue="40817810*****12345" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <button className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
          Сохранить реквизиты
        </button>
      </div>
    </div>
  );
};
