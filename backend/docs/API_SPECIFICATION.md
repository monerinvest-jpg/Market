# HandMade Market — API Specification (OpenAPI 3.0.0)

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Bearer JWT токен в заголовке:
```
Authorization: Bearer <access_token>
```

---

## Roles

| Role   | Description               |
|--------|---------------------------|
| buyer  | Покупатель (по умолчанию) |
| seller | Продавец                  |
| admin  | Администратор             |

---

## Endpoints

### 🔐 AUTH

| Method | Path              | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | /auth/register    | —    | Регистрация              |
| POST   | /auth/login       | —    | Вход                     |
| POST   | /auth/refresh     | —    | Обновление токена        |
| POST   | /auth/logout      | —    | Выход                    |

#### POST /auth/register
```json
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "secret123",
  "role": "buyer",
  "city": "Москва"
}
```
Response 201:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": { "id": "...", "name": "...", "email": "...", "role": "buyer" }
}
```

---

### 👤 USERS

| Method | Path               | Auth    | Description               |
|--------|--------------------|---------|---------------------------|
| GET    | /users/me          | any     | Текущий профиль           |
| PUT    | /users/me          | any     | Обновить профиль          |
| GET    | /users/{id}        | —       | Публичный профиль         |
| GET    | /users             | admin   | Список пользователей      |
| PATCH  | /users/{id}/block  | admin   | Блокировка                |
| DELETE | /users/{id}        | admin   | Удалить                   |

---

### 🛍️ PRODUCTS

| Method | Path                      | Auth         | Description               |
|--------|---------------------------|--------------|---------------------------|
| GET    | /products                 | —            | Список с фильтрами        |
| GET    | /products/featured        | —            | Рекомендуемые             |
| GET    | /products/{id}            | —            | Детали товара             |
| POST   | /products                 | seller/admin | Создать товар             |
| PUT    | /products/{id}            | seller/admin | Обновить товар            |
| DELETE | /products/{id}            | seller/admin | Удалить товар             |
| PATCH  | /products/{id}/approve    | admin        | Модерация                 |

#### Query params /products:
- `q` — поиск по тексту
- `category_id` — фильтр по категории
- `min_price`, `max_price` — диапазон цен
- `in_stock` — только в наличии
- `sort` — popular | new | price_asc | price_desc | rating
- `page`, `limit` — пагинация

---

### 🏪 SHOPS

| Method | Path        | Auth         | Description          |
|--------|-------------|--------------|----------------------|
| GET    | /shops      | —            | Список магазинов     |
| GET    | /shops/my   | seller       | Мой магазин          |
| GET    | /shops/{id} | —            | Детали магазина      |
| POST   | /shops      | seller       | Создать магазин      |
| PUT    | /shops/{id} | seller/admin | Обновить магазин     |

---

### 📦 ORDERS

| Method | Path                   | Auth         | Description          |
|--------|------------------------|--------------|----------------------|
| GET    | /orders                | buyer/seller | Мои заказы           |
| GET    | /orders/{id}           | any          | Детали заказа        |
| POST   | /orders                | buyer        | Создать заказ        |
| PATCH  | /orders/{id}/status    | seller/admin | Изменить статус      |

#### POST /orders body:
```json
{
  "items": [
    { "product_id": "...", "quantity": 2, "variant": "Размер 17" }
  ],
  "delivery_address": "г. Москва, ул. Ленина, 1",
  "delivery_method": "СДЭК",
  "payment_method": "Банковская карта",
  "promo_code": "CRAFT10"
}
```

Order statuses: new → paid → shipped → delivered → completed | cancelled

---

### 🗂️ CATEGORIES

| Method | Path         | Auth  | Description         |
|--------|--------------|-------|---------------------|
| GET    | /categories  | —     | Дерево категорий    |
| POST   | /categories  | admin | Создать категорию   |

---

### ⭐ REVIEWS

| Method | Path                      | Auth   | Description        |
|--------|---------------------------|--------|--------------------|
| GET    | /reviews/product/{id}     | —      | Отзывы на товар    |
| GET    | /reviews/shop/{id}        | —      | Отзывы на магазин  |
| POST   | /reviews                  | buyer  | Оставить отзыв     |
| PATCH  | /reviews/{id}/reply       | seller | Ответ продавца     |
| DELETE | /reviews/{id}             | admin  | Удалить отзыв      |

---

### 🛒 CART

| Method | Path              | Auth  | Description           |
|--------|-------------------|-------|-----------------------|
| GET    | /cart             | buyer | Получить корзину      |
| POST   | /cart/items       | buyer | Добавить в корзину    |
| PUT    | /cart/items/{id}  | buyer | Обновить количество   |
| DELETE | /cart/items/{id}  | buyer | Удалить из корзины    |
| DELETE | /cart             | buyer | Очистить корзину      |

---

### ❤️ FAVORITES

| Method | Path                    | Auth  | Description            |
|--------|-------------------------|-------|------------------------|
| GET    | /favorites              | buyer | Список избранных       |
| POST   | /favorites/{product_id} | buyer | Добавить/удалить       |
| DELETE | /favorites/{product_id} | buyer | Удалить из избранного  |

---

### 🏷️ PROMO CODES

| Method | Path                    | Auth  | Description         |
|--------|-------------------------|-------|---------------------|
| POST   | /promo-codes/validate   | any   | Проверить промокод  |
| GET    | /promo-codes            | admin | Список промокодов   |
| POST   | /promo-codes            | admin | Создать промокод    |
| PATCH  | /promo-codes/{id}/toggle| admin | Вкл/выкл            |
| DELETE | /promo-codes/{id}       | admin | Удалить             |

---

### 💬 MESSAGES

| Method | Path                | Auth | Description           |
|--------|---------------------|------|-----------------------|
| GET    | /messages           | any  | Мои сообщения         |
| POST   | /messages           | any  | Отправить сообщение   |
| PATCH  | /messages/{id}/read | any  | Прочитать сообщение   |

---

### 📊 ADMIN STATS

| Method | Path                 | Auth  | Description          |
|--------|----------------------|-------|----------------------|
| GET    | /admin/stats         | admin | Общая статистика     |
| GET    | /admin/stats/revenue | admin | График выручки       |

---

## Error Codes

| Code | Description                    |
|------|--------------------------------|
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized                   |
| 403  | Forbidden (role mismatch)      |
| 404  | Not Found                      |
| 409  | Conflict (duplicate)           |
| 500  | Internal Server Error          |

## Database Schema

12 tables: users, shops, categories, products, orders, order_items,
           reviews, cart_items, favorites, messages, promo_codes

All IDs are UUIDs (VARCHAR 36).
All timestamps are UTC DATETIME.
JSON columns store arrays (images, tags, materials, colors, sizes).
