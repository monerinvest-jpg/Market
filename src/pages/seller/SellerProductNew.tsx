import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { shopAPI, productAPI, categoryAPI } from '../../db/database';
import { ArrowLeft, Save } from 'lucide-react';

export const SellerProductNew: React.FC = () => {
  const { user, navigate, showNotification } = useStore();
  const shop = user ? shopAPI.getBySeller(user.id) : undefined;
  const categories = categoryAPI.getAll();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [materials, setMaterials] = useState('');
  const [tags, setTags] = useState('');
  const [stockCount, setStockCount] = useState('1');
  const [productionDays, setProductionDays] = useState('3');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !user) { showNotification('Магазин не найден', 'error'); return; }
    if (!name || !price || !categoryId) { showNotification('Заполните обязательные поля', 'error'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const cat = categories.find(c => c.id === categoryId);
    const images = imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop'];

    productAPI.create({
      shopId: shop.id,
      shopName: shop.name,
      sellerId: user.id,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-а-яё]/gi, '') + '-' + Date.now(),
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      images,
      category: cat?.name || '',
      categoryId,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      colors: [],
      sizes: [],
      inStock: true,
      stockCount: Number(stockCount),
      productionDays: Number(productionDays),
      isDigital: false,
      isCustomizable: false,
      status: 'pending',
      isFeatured: false,
      deliveryMethods: ['Почта России', 'СДЭК'],
      city: shop.city,
    });

    setLoading(false);
    showNotification('Товар отправлен на модерацию!', 'success');
    navigate('seller-products');
  };

  return (
    <div>
      <button onClick={() => navigate('seller-products')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
        <ArrowLeft size={14} /> К товарам
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Добавить новый товар</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Название товара *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Серебряное кольцо с янтарём"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Подробно опишите товар: материалы, размеры, особенности..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена * (₽)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="2500"
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Старая цена (₽) — необязательно</label>
            <input
              type="number"
              value={oldPrice}
              onChange={e => setOldPrice(e.target.value)}
              placeholder="3000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL фотографии</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Количество в наличии</label>
            <input
              type="number"
              value={stockCount}
              onChange={e => setStockCount(e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Срок изготовления (дней)</label>
            <input
              type="number"
              value={productionDays}
              onChange={e => setProductionDays(e.target.value)}
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Материалы (через запятую)</label>
            <input
              type="text"
              value={materials}
              onChange={e => setMaterials(e.target.value)}
              placeholder="Серебро 925, Янтарь"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Теги (через запятую)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="кольцо, серебро, янтарь"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {imageUrl && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Предпросмотр фото:</div>
            <img src={imageUrl} alt="preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          ⚠️ После добавления товар отправляется на модерацию. Обычно проверка занимает 1-2 рабочих дня.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-semibold transition-colors"
        >
          <Save size={16} />
          {loading ? 'Сохранение...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  );
};
