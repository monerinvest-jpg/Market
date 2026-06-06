import React, { useState } from 'react';
import { Plus, Edit, Archive, Copy, Star, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { products } from '../../data/mockData';

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Активен', color: 'text-emerald-700 bg-emerald-50' },
  pending: { label: 'На модерации', color: 'text-amber-700 bg-amber-50' },
  draft: { label: 'Черновик', color: 'text-gray-700 bg-gray-100' },
  rejected: { label: 'Отклонён', color: 'text-red-700 bg-red-50' },
  archived: { label: 'Архив', color: 'text-gray-500 bg-gray-50' },
};

export const SellerProducts: React.FC = () => {
  const { showNotification } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const shopProducts = products.filter(p => p.shopId === 'shop-1');

  if (showAddForm) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">← Назад</button>
          <h2 className="text-xl font-bold text-gray-900">Добавить товар</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Название товара', type: 'text', placeholder: 'Например: Серебряное кольцо с аметистом' },
          ].map(field => (
            <div key={field.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          ))}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
            <textarea rows={4} placeholder="Опишите ваш товар..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена, ₽</label>
              <input type="number" placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Старая цена, ₽</label>
              <input type="number" placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Остаток, шт.</label>
              <input type="number" placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option>Украшения</option>
              <option>Одежда</option>
              <option>Керамика</option>
              <option>Предметы интерьера</option>
              <option>Подарки</option>
              <option>Косметика</option>
              <option>Цифровые товары</option>
            </select>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Фотографии (до 10 шт.)</label>
            <div className="grid grid-cols-5 gap-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors">
                  <Plus size={20} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { showNotification('Товар отправлен на модерацию', 'success'); setShowAddForm(false); }} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors">
              Отправить на модерацию
            </button>
            <button onClick={() => { showNotification('Сохранено как черновик', 'info'); setShowAddForm(false); }} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Черновик
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Мои товары ({shopProducts.length})</h2>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} />
          Добавить товар
        </button>
      </div>

      <div className="space-y-3">
        {shopProducts.map(product => {
          const status = statusLabels[product.status] || { label: product.status, color: 'text-gray-700 bg-gray-100' };
          return (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm truncate">{product.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{product.category}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${status.color}`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500"><Star size={11} className="text-amber-400 fill-amber-400" />{product.rating}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500"><ShoppingBag size={11} />{product.salesCount} продаж</div>
                  <div className="text-xs text-gray-500">Остаток: {product.stockCount}</div>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => showNotification('Редактирование товара', 'info')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><Edit size={16} /></button>
                <button onClick={() => showNotification('Товар дублирован', 'success')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><Copy size={16} /></button>
                <button onClick={() => showNotification('Товар архивирован', 'info')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><Archive size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
