import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authMode, closeAuthModal, login, register, loginAs, openAuthModal } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (authMode === 'login') {
      const ok = login(email, password);
      if (!ok) setError('Неверный email или пароль');
    } else {
      if (!name.trim()) { setError('Введите имя'); setLoading(false); return; }
      if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); setLoading(false); return; }
      const ok = register(name, email, password, role);
      if (!ok) setError('Пользователь с таким email уже существует');
    }
    setLoading(false);
  };

  const handleQuickLogin = (r: 'buyer' | 'seller' | 'admin') => {
    loginAs(r);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <X size={18} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-3xl">🧶</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {authMode === 'login' ? 'Войдите, чтобы продолжить' : 'Создайте новый аккаунт'}
            </p>
          </div>

          {/* Quick login */}
          <div className="mb-5 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">Быстрый вход (демо)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleQuickLogin('buyer')} className="py-2 px-2 bg-white border border-gray-200 hover:border-amber-400 rounded-xl text-xs font-medium text-gray-700 transition-colors text-center">
                🛍️<br />Покупатель
              </button>
              <button onClick={() => handleQuickLogin('seller')} className="py-2 px-2 bg-white border border-gray-200 hover:border-amber-400 rounded-xl text-xs font-medium text-gray-700 transition-colors text-center">
                🏪<br />Продавец
              </button>
              <button onClick={() => handleQuickLogin('admin')} className="py-2 px-2 bg-white border border-gray-200 hover:border-amber-400 rounded-xl text-xs font-medium text-gray-700 transition-colors text-center">
                👑<br />Админ
              </button>
            </div>
          </div>

          <div className="relative my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">или</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Иван Петров"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Я регистрируюсь как</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('buyer')} className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${role === 'buyer' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    🛍️ Покупатель
                  </button>
                  <button type="button" onClick={() => setRole('seller')} className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${role === 'seller' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    🏪 Продавец
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-semibold transition-colors text-sm"
            >
              {loading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {authMode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={() => openAuthModal(authMode === 'login' ? 'register' : 'login')}
              className="text-amber-600 font-semibold hover:underline"
            >
              {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>

          {authMode === 'login' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <div><strong>Покупатель:</strong> ivan@market.ru / buyer123</div>
              <div><strong>Продавец:</strong> olga@market.ru / seller123</div>
              <div><strong>Админ:</strong> admin@market.ru / admin123</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
