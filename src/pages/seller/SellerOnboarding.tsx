import React, { useState } from 'react';
import { Store, User, FileText, Settings, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

const steps = [
  { title: 'Тип продавца', icon: <User size={20} />, desc: 'Выберите правовую форму' },
  { title: 'Данные продавца', icon: <FileText size={20} />, desc: 'Заполните реквизиты' },
  { title: 'Создание магазина', icon: <Store size={20} />, desc: 'Оформите страницу магазина' },
  { title: 'Готово!', icon: <CheckCircle size={20} />, desc: 'Магазин отправлен на модерацию' },
];

export const SellerOnboarding: React.FC = () => {
  const { login, navigate, showNotification } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [sellerType, setSellerType] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      login('seller');
      navigate('seller-dashboard');
      showNotification('Магазин создан и отправлен на модерацию!', 'success');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Открыть магазин на CraftMarket</h1>
        <p className="text-gray-500">Начните продавать тысячам покупателей по всей России</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <div className={`flex items-center gap-1.5 ${i <= currentStep ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < currentStep ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>
                {i < currentStep ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium">{step.title}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px max-w-8 ${i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        {currentStep === 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Выберите тип продавца</h2>
            <div className="space-y-3">
              {[
                { id: 'individual', title: 'Физическое лицо', desc: 'Продажа без ИП, ограничения по объёмам', icon: '👤' },
                { id: 'self_employed', title: 'Самозанятый', desc: 'Официальный статус, налоги через «Мой налог»', icon: '💼' },
                { id: 'ip', title: 'Индивидуальный предприниматель', desc: 'ИП с расчётным счётом', icon: '🏢' },
                { id: 'ooo', title: 'ООО', desc: 'Юридическое лицо, полный документооборот', icon: '🏦' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setSellerType(type.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all ${sellerType === type.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-200'}`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{type.title}</div>
                    <div className="text-sm text-gray-500">{type.desc}</div>
                  </div>
                  {sellerType === type.id && <CheckCircle size={20} className="text-amber-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Данные продавца</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ФИО / Название организации</label>
                <input type="text" placeholder="Иванова Мария Ивановна" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ИНН</label>
                <input type="text" placeholder="123456789012" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              {(sellerType === 'ip' || sellerType === 'ooo') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ОГРН / ОГРНИП</label>
                  <input type="text" placeholder="ОГРН" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Контактный телефон</label>
                <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                ⚠️ Принимая оферту продавца, вы соглашаетесь с условиями маркетплейса и комиссией платформы.
                <button className="block text-amber-600 font-semibold underline mt-1">Читать оферту →</button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                <span className="text-sm text-gray-700">Принимаю оферту продавца</span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Создание магазина</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Название магазина</label>
                <input value={shopName} onChange={e => setShopName(e.target.value)} type="text" placeholder="Мастерская Иванова" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                <textarea value={shopDesc} onChange={e => setShopDesc(e.target.value)} rows={3} placeholder="Расскажите о вашем магазине и изделиях..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Город</label>
                <input type="text" placeholder="Москва" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Логотип магазина</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors">
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-sm text-gray-500">Нажмите для загрузки или перетащите файл</div>
                  <div className="text-xs text-gray-400 mt-1">JPG, PNG, до 5 МБ</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Магазин отправлен на модерацию!</h2>
            <p className="text-gray-500 text-sm mb-6">Мы проверим ваш магазин в течение 1–2 рабочих дней. После одобрения вы сможете добавлять товары.</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[['1–2 дня', 'Срок проверки'], ['0 ₽', 'Регистрация'], ['12%', 'Базовая комиссия']].map(([v, l]) => (
                <div key={l} className="p-3 bg-amber-50 rounded-xl">
                  <div className="text-xl font-bold text-amber-700">{v}</div>
                  <div className="text-xs text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={currentStep === 0 && !sellerType}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Перейти в кабинет продавца' : 'Продолжить'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
