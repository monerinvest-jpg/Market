import React, { useState } from 'react';
import { promoAPI } from '../../db/database';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminPromo: React.FC = () => {
  const { showNotification } = useStore();
  const [promos, setPromos] = useState(promoAPI.getAll());
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed' | 'free_delivery'>('percent');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [limit, setLimit] = useState('100');
  const [expires, setExpires] = useState('2025-12-31');

  const reload = () => setPromos(promoAPI.getAll());

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    promoAPI.create({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrder) || 0,
      usageLimit: Number(limit) || 100,
      expiresAt: expires,
      isActive: true,
    });
    reload();
    showNotification('Промокод создан!', 'success');
    setShowForm(false);
    setCode(''); setValue(''); setMinOrder('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Удалить промокод?')) return;
    promoAPI.delete(id);
    reload();
    showNotification('Промокод удалён', 'success');
  };

  const handleToggle = (id: string) => {
    promoAPI.toggle(id);
    reload();
  };

  const typeLabels: Record<string, string> = {
    percent: 'Процент', fixed: 'Фиксированная сумма', free_delivery: 'Бесплатная доставка',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Промокоды ({promos.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <Plus size={15} /> Создать
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Новый промокод</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Код *</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SUMMER20" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип скидки</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="percent">Процент (%)</option>
                <option value="fixed">Фиксированная (₽)</option>
                <option value="free_delivery">Бесплатная доставка</option>
              </select>
            </div>
            {type !== 'free_delivery' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Значение {type === 'percent' ? '(%)' : '(₽)'}</label>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={type === 'percent' ? '10' : '500'} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Мин. сумма заказа (₽)</label>
              <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="1000" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Лимит использований</label>
              <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата истечения</label>
              <input type="date" value={expires} onChange={e => setExpires(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">Создать</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Отмена</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {promos.map(promo => (
          <div key={promo.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 ${!promo.isActive ? 'opacity-60 border-gray-100' : 'border-gray-100'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="font-mono font-bold text-gray-900 text-sm bg-gray-100 px-2 py-0.5 rounded">{promo.code}</code>
                <span className="text-xs text-gray-500">{typeLabels[promo.type]}</span>
                {promo.type !== 'free_delivery' && <span className="text-xs font-semibold text-amber-600">{promo.type === 'percent' ? `-${promo.value}%` : `-${promo.value} ₽`}</span>}
                {promo.type === 'free_delivery' && <span className="text-xs font-semibold text-green-600">Бесплатная доставка</span>}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {promo.isActive ? '✅ Активен' : '⏸ Отключён'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Мин. заказ: {promo.minOrderAmount.toLocaleString()} ₽ • Использований: {promo.usageCount}/{promo.usageLimit} • До: {promo.expiresAt}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleToggle(promo.id)} className="p-2 text-gray-400 hover:text-amber-500 rounded-xl hover:bg-amber-50 transition-colors">
                {promo.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              </button>
              <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {promos.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm">Промокодов нет</div>
        )}
      </div>
    </div>
  );
};
