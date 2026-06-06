import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authMode, closeAuthModal, login, openAuthModal } = useStore();
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} className="text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === 'login' ? 'Войти в CraftMarket' : 'Создать аккаунт'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {authMode === 'login' ? 'Введите свои данные для входа' : 'Присоединяйтесь к нашему сообществу мастеров'}
          </p>
        </div>

        {/* Demo role selector */}
        <div className="mb-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs font-semibold text-amber-700 mb-2">🎭 Демо: выберите роль для входа</p>
          <div className="grid grid-cols-3 gap-2">
            {(['buyer', 'seller', 'admin'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${role === r ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-amber-100'}`}
              >
                {r === 'buyer' ? '👤 Покупатель' : r === 'seller' ? '🏪 Продавец' : '⚙️ Админ'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); login(role); }} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя и фамилия</label>
              <input type="text" placeholder="Иван Петров" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email или телефон</label>
            <input type="email" placeholder="ivan@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent pr-12" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Реферальный код (необязательно)</label>
              <input type="text" placeholder="Код друга" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
          )}
          {authMode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-amber-600 hover:text-amber-700 font-medium">Забыли пароль?</button>
            </div>
          )}
          <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors">
            {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            {authMode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={() => openAuthModal(authMode === 'login' ? 'register' : 'login')}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
