import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft } from 'lucide-react';

export const HowToBuyPage: React.FC = () => {
  const { navigate } = useStore();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6"><ArrowLeft size={14} /> На главную</button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Как сделать заказ</h1>
      <div className="space-y-6">
        {[
          { num: '01', emoji: '🔍', title: 'Найдите нужный товар', text: 'Используйте поиск или каталог. Вы можете фильтровать товары по категории, цене, городу и другим параметрам.' },
          { num: '02', emoji: '🛒', title: 'Добавьте в корзину', text: 'Выберите нужный размер, цвет и количество. Нажмите кнопку «В корзину». Можно добавить товары из разных магазинов.' },
          { num: '03', emoji: '📋', title: 'Оформите заказ', text: 'Перейдите в корзину. Введите адрес доставки, выберите способ доставки (СДЭК, Почта России, Курьер) и метод оплаты.' },
          { num: '04', emoji: '💳', title: 'Оплатите', text: 'Доступны: банковская карта, СБП, ЮMoney. Также можно использовать бонусные баллы или промокод.' },
          { num: '05', emoji: '⏳', title: 'Ожидайте', text: 'Мастер получит уведомление и приступит к изготовлению. Вы можете отслеживать статус в разделе «Мои заказы».' },
          { num: '06', emoji: '📦', title: 'Получите заказ', text: 'После получения подтвердите доставку в личном кабинете и оставьте отзыв. Оплата переходит продавцу только после вашего подтверждения.' },
        ].map(s => (
          <div key={s.num} className="flex gap-4">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">{s.num}</div>
            <div>
              <div className="font-semibold text-gray-900">{s.emoji} {s.title}</div>
              <p className="text-gray-600 text-sm mt-1">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700">
        💡 Если у вас возникли проблемы с заказом — откройте спор в личном кабинете. Мы всегда на вашей стороне!
      </div>
    </div>
  );
};

export const HowToSellPage: React.FC = () => {
  const { navigate, openAuthModal } = useStore();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6"><ArrowLeft size={14} /> На главную</button>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Как начать продавать</h1>
      <p className="text-gray-600 mb-8">Откройте магазин бесплатно и начните зарабатывать на своём творчестве</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {['Украшения', 'Керамика и посуда', 'Картины и постеры', 'Вязаные изделия', 'Натуральная косметика', 'Цифровые товары'].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-700">✅ {item}</div>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        {[
          { num: '1', title: 'Зарегистрируйтесь как продавец', text: 'Создайте аккаунт, выбрав роль «Продавец». Это бесплатно и занимает 2 минуты.' },
          { num: '2', title: 'Создайте магазин', text: 'Заполните название, описание, добавьте логотип и баннер. Настройте условия доставки и возврата.' },
          { num: '3', title: 'Добавьте товары', text: 'Загрузите фотографии, укажите описание, цену, материалы. Товар пройдёт модерацию в течение 1-2 дней.' },
          { num: '4', title: 'Продавайте!', text: 'Принимайте заказы, общайтесь с покупателями, отправляйте посылки. Получайте оплату на карту.' },
        ].map(s => (
          <div key={s.num} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">{s.num}</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
              <p className="text-gray-500 text-xs mt-0.5">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
        <div className="text-3xl mb-3">🎨</div>
        <h3 className="text-xl font-bold mb-2">Комиссия всего 7%</h3>
        <p className="text-gray-400 text-sm mb-5">Мы берём комиссию только с успешных продаж. Регистрация и ведение магазина — бесплатно.</p>
        <button onClick={() => openAuthModal('register')} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-colors">
          Открыть магазин бесплатно
        </button>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const { navigate } = useStore();
  const faqs = [
    { q: 'Как оплатить заказ?', a: 'Мы принимаем банковские карты (Visa, Mastercard, МИР), СБП и ЮMoney. Все оплаты защищены.' },
    { q: 'Как долго ждать заказ?', a: 'Срок зависит от товара. Обычно изготовление занимает 3-14 дней, доставка — ещё 3-7 дней в зависимости от региона.' },
    { q: 'Можно ли вернуть товар?', a: 'Да, в течение 14 дней при сохранении товарного вида. Для некоторых категорий (например, косметика) возврат не предусмотрен по санитарным нормам.' },
    { q: 'Как отследить посылку?', a: 'Трек-номер появится в разделе «Мои заказы» после отправки. Вы также получите уведомление на email.' },
    { q: 'Что делать если товар пришёл повреждённым?', a: 'Откройте спор в личном кабинете в разделе заказа. Приложите фото. Мы рассмотрим спор в течение 3 рабочих дней.' },
    { q: 'Можно ли сделать индивидуальный заказ?', a: 'Да! Многие мастера принимают заказы по индивидуальным параметрам. Напишите им через чат магазина.' },
    { q: 'Как использовать промокод?', a: 'Введите промокод в корзине в поле «Промокод» перед оформлением заказа.' },
    { q: 'Когда начисляются бонусы?', a: 'Бонусы начисляются после подтверждения получения заказа. 1 бонус = 1 рубль скидки.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6"><ArrowLeft size={14} /> На главную</button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Частые вопросы</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
              {faq.q}
              <span className="text-amber-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
};
