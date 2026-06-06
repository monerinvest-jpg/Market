import React, { useState } from 'react';
import { userAPI } from '../../db/database';
import { Search, Ban, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  seller: 'bg-blue-100 text-blue-700',
  buyer: 'bg-green-100 text-green-700',
};
const roleLabels: Record<string, string> = {
  admin: '👑 Администратор',
  seller: '🏪 Продавец',
  buyer: '🛍️ Покупатель',
};

export const AdminUsers: React.FC = () => {
  const { showNotification } = useStore();
  const [users, setUsers] = useState(userAPI.getAll().filter(u => u.role !== 'admin'));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const reload = () => setUsers(userAPI.getAll().filter(u => u.role !== 'admin'));

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleBlock = (id: string) => {
    userAPI.block(id);
    reload();
    showNotification('Статус пользователя изменён', 'success');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Удалить пользователя?')) return;
    userAPI.delete(id);
    reload();
    showNotification('Пользователь удалён', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Пользователи ({filtered.length})</h2>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или email..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">Все роли</option>
          <option value="buyer">Покупатели</option>
          <option value="seller">Продавцы</option>
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Пользователь</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Роль</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Город</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Зарегистрирован</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(user => (
              <tr key={user.id} className={`hover:bg-gray-50 ${user.isBlocked ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{user.city || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {user.isBlocked ? '🔴 Заблокирован' : '🟢 Активен'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleBlock(user.id)}
                      title={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                      className={`p-1.5 rounded-lg transition-colors ${user.isBlocked ? 'text-green-500 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                    >
                      <Ban size={14} />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">Пользователи не найдены</div>
        )}
      </div>
    </div>
  );
};
