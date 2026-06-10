"""
Seed initial data into the database.
Run: python -m app.seed
"""
import asyncio
import uuid
from datetime import date

from sqlalchemy import select

from app.database import AsyncSessionLocal, init_db
from app.models.category import Category
from app.models.user import User, UserRole
from app.models.shop import Shop, ShopStatus
from app.models.product import Product, ProductStatus
from app.models.promo_code import PromoCode, PromoType
from app.utils.auth import hash_password


CATEGORIES = [
    {"id": "cat-1",  "name": "Украшения",          "slug": "ukrasheniya",       "icon": "💍"},
    {"id": "cat-1-1","name": "Кольца",              "slug": "koltsa",            "icon": "💍", "parent_id": "cat-1"},
    {"id": "cat-1-2","name": "Серьги",              "slug": "sergi",             "icon": "✨", "parent_id": "cat-1"},
    {"id": "cat-1-3","name": "Браслеты",            "slug": "braslety",          "icon": "📿", "parent_id": "cat-1"},
    {"id": "cat-2",  "name": "Одежда",              "slug": "odezhda",           "icon": "👗"},
    {"id": "cat-3",  "name": "Предметы интерьера",  "slug": "interer",           "icon": "🏺"},
    {"id": "cat-4",  "name": "Керамика",            "slug": "keramika",          "icon": "🫙"},
    {"id": "cat-5",  "name": "Подарки",             "slug": "podarki",           "icon": "🎁"},
    {"id": "cat-6",  "name": "Косметика",           "slug": "kosmetika",         "icon": "🌿"},
    {"id": "cat-7",  "name": "Товары для творчества","slug": "tvorchestvo",      "icon": "🎨"},
    {"id": "cat-8",  "name": "Цифровые товары",     "slug": "tsifrovye",         "icon": "💾"},
    {"id": "cat-9",  "name": "Аксессуары",          "slug": "aksessuary",        "icon": "👜"},
    {"id": "cat-10", "name": "Картины и арт",       "slug": "kartiny",           "icon": "🖼️"},
]

USERS = [
    {"id": "user-admin-1", "name": "Администратор", "email": "admin@market.ru",  "password": "admin123",  "role": UserRole.admin},
    {"id": "user-seller-1","name": "Ольга Мастерова","email": "olga@market.ru",  "password": "seller123", "role": UserRole.seller, "city": "Москва"},
    {"id": "user-seller-2","name": "Михаил Гончаров","email": "misha@market.ru", "password": "seller123", "role": UserRole.seller, "city": "Санкт-Петербург"},
    {"id": "user-buyer-1", "name": "Иван Петров",   "email": "ivan@market.ru",   "password": "buyer123",  "role": UserRole.buyer,  "city": "Москва", "bonus_balance": 600},
    {"id": "user-buyer-2", "name": "Мария Сидорова","email": "maria@market.ru",  "password": "buyer123",  "role": UserRole.buyer,  "city": "Казань", "bonus_balance": 200},
]

PROMO_CODES = [
    {"id": "promo-1", "code": "CRAFT10",   "type": PromoType.percent,      "value": 10,  "min_order_amount": 1000, "usage_limit": 100, "expires_at": date(2026,12,31)},
    {"id": "promo-2", "code": "WELCOME500","type": PromoType.fixed,         "value": 500, "min_order_amount": 2000, "usage_limit": 50,  "expires_at": date(2026, 6,30)},
    {"id": "promo-3", "code": "FREEDEL",  "type": PromoType.free_delivery, "value": 0,   "min_order_amount": 3000, "usage_limit": 200, "expires_at": date(2026,12,31)},
]


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # Categories
        for c in CATEGORIES:
            exists = await db.get(Category, c["id"])
            if not exists:
                db.add(Category(
                    id=c["id"], name=c["name"], slug=c["slug"],
                    icon=c.get("icon"), parent_id=c.get("parent_id"),
                ))

        # Users
        for u in USERS:
            exists = await db.get(User, u["id"])
            if not exists:
                db.add(User(
                    id=u["id"], name=u["name"], email=u["email"],
                    password_hash=hash_password(u["password"]),
                    role=u["role"],
                    city=u.get("city"),
                    bonus_balance=u.get("bonus_balance", 0),
                    referral_code=u["id"][:8].upper(),
                ))

        # Promo codes
        for p in PROMO_CODES:
            exists = await db.get(PromoCode, p["id"])
            if not exists:
                db.add(PromoCode(**p))

        await db.commit()
        print("✅ Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
