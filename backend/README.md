# HandMade Market — Backend API

FastAPI + MySQL бэкенд для маркетплейса изделий ручной работы.
Разработан как REST API-сервер для React-фронтенда (https://github.com/monerinvest-jpg/Market).

## Стек технологий

- **Python 3.10+**
- **FastAPI** — веб-фреймворк
- **MySQL** — база данных
- **SQLAlchemy 2.0** (async) + **aiomysql** — ORM и драйвер
- **Alembic** — миграции БД
- **JWT** (python-jose) — аутентификация
- **bcrypt** (passlib) — хеширование паролей
- **Pydantic v2** — валидация данных

## Быстрый старт

### 1. Установка зависимостей

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 2. Настройка MySQL

```sql
CREATE DATABASE handmade_market
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 3. Переменные окружения

```bash
cp .env.example .env
# Откройте .env и заполните значения
```

### 4. Миграции

```bash
alembic upgrade head
```

### 5. Seed-данные (опционально)

```bash
python -m app.seed
```

### 6. Запуск

```bash
# Разработка
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Продакшен
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000
```

## Документация API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Тестовые аккаунты (после seed)

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Admin   | admin@market.ru    | admin123   |
| Seller  | olga@market.ru     | seller123  |
| Buyer   | ivan@market.ru     | buyer123   |

## Структура проекта

```
backend-python-mysql/
├── .env.example          # шаблон переменных окружения
├── requirements.txt      # зависимости Python
├── alembic.ini           # конфигурация Alembic
├── app/
│   ├── main.py           # точка входа FastAPI
│   ├── config.py         # настройки из .env
│   ├── database.py       # engine, сессии, Base
│   ├── middleware.py      # логирование запросов
│   ├── seed.py           # начальные данные
│   ├── models/           # SQLAlchemy модели
│   ├── schemas/          # Pydantic схемы
│   ├── crud/             # операции с БД
│   ├── routers/          # API эндпоинты
│   └── utils/            # JWT, bcrypt, исключения
├── migrations/           # Alembic миграции
├── docs/                 # API спецификация
└── tests/                # pytest тесты
```

## Роли пользователей

- **buyer** — покупатель: корзина, заказы, избранное, отзывы
- **seller** — продавец: управление магазином и товарами, просмотр заказов
- **admin** — администратор: полный доступ, модерация, статистика

## Запуск тестов

```bash
pytest tests/ -v
```
