import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { userAPI } from '../../db/database';
import { User, Mail, Phone, MapPin, Gift, Save } from 'lucide-react';

export const BuyerProfile: React.FC = () => {
  const { user, showNotification } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!user) return;
    userAPI.update(user.id, { name, phone, city });
    showNotification('Профиль обновлён', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Личные данные</h2>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{user?.name}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          <div className="text-xs mt-1 inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            🎁 {user?.bonusBalance} бонусов
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <User size={14} /> Имя и фамилия
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Mail size={14} /> Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Phone size={14} /> Телефон
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+7 (999) 000-00-00"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} /> Город
          </label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Москва"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Gift size={20} className="text-amber-500 flex-shrink-0" />
        <div>
          <div className="font-semibold text-gray-900 text-sm">Реферальный код: <span className="text-amber-600">{user?.referralCode}</span></div>
          <div className="text-xs text-gray-500 mt-0.5">Поделитесь кодом и получайте бонусы за каждого приглашённого</div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors text-sm"
      >
        <Save size={16} />
        {saved ? '✓ Сохранено!' : 'Сохранить изменения'}
      </button>
    </div>
  );
};
