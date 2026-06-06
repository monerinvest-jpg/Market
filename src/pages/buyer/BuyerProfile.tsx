import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Bell, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const BuyerProfile: React.FC = () => {
  const { user, showNotification } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Профиль успешно обновлён', 'success');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Мой профиль</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={18} className="text-amber-500" />Личные данные</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя и фамилия</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Город</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={city} onChange={e => setCity(e.target.value)} className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-500" />Уведомления</h3>
          <div className="space-y-3">
            {[
              ['Статусы заказов', true],
              ['Новые сообщения', true],
              ['Начисление бонусов', true],
              ['Акции и новинки', false],
              ['Новости платформы', false],
            ].map(([label, defaultChecked]) => (
              <label key={String(label)} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{label}</span>
                <input type="checkbox" defaultChecked={defaultChecked as boolean} className="w-4 h-4 text-amber-500 rounded" />
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Безопасность</h3>
          <div className="space-y-3">
            <button type="button" className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Изменить пароль
            </button>
            <button type="button" className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Привязать телефон
            </button>
          </div>
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors">
          <Save size={16} />
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};
