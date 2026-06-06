import React from 'react';
import { useStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const { navigate } = useStore();
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <span className="text-white text-xl font-bold">CraftMarket</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Маркетплейс уникальных товаров ручной работы от российских мастеров
            </p>
            <div className="flex gap-3">
              {['VK', 'TG', 'OK'].map(s => (
                <a key={s} href="#" className="w-8 h-8 bg-gray-700 hover:bg-amber-600 rounded-lg flex items-center justify-center text-xs font-bold transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Buyers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Покупателям</h4>
            <ul className="space-y-2">
              {[
                ['Как купить', 'info-how-to-buy'],
                ['Доставка', 'info-delivery'],
                ['Оплата', 'info-payment'],
                ['Возвраты', 'info-returns'],
                ['Помощь / FAQ', 'info-faq'],
              ].map(([label, page]) => (
                <li key={page}>
                  <button onClick={() => navigate(page as any)} className="text-sm hover:text-amber-400 transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Продавцам</h4>
            <ul className="space-y-2">
              {[
                ['Как продавать', 'info-how-to-sell'],
                ['Тарифы', 'info-how-to-sell'],
                ['Оферта продавца', 'info-about'],
                ['Правила размещения', 'info-about'],
                ['Кабинет продавца', 'seller-onboarding'],
              ].map(([label, page]) => (
                <li key={label}>
                  <button onClick={() => navigate(page as any)} className="text-sm hover:text-amber-400 transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              {[
                ['О проекте', 'info-about'],
                ['Реферальная программа', 'buyer-referral'],
                ['Контакты', 'info-contacts'],
              ].map(([label, page]) => (
                <li key={label}>
                  <button onClick={() => navigate(page as any)} className="text-sm hover:text-amber-400 transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@craftmarket.ru</li>
              <li>📞 8-800-555-00-00</li>
              <li className="text-xs">Пн–Пт: 9:00–20:00</li>
              <li className="text-xs">Сб–Вс: 10:00–18:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2024 CraftMarket. Все права защищены.</p>
          <div className="flex gap-4">
            {['Пользовательское соглашение', 'Политика конфиденциальности'].map(t => (
              <button key={t} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
