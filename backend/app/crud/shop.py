from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.shop import Shop
from app.schemas.shop import ShopCreate, ShopUpdate
from app.crud.base import CRUDBase
import uuid


class CRUDShop(CRUDBase[Shop]):
    async def get_by_seller(self, db: AsyncSession, seller_id: str) -> Optional[Shop]:
        result = await db.execute(select(Shop).where(Shop.seller_id == seller_id))
        return result.scalar_one_or_none()

    async def create_shop(self, db: AsyncSession, data: ShopCreate, seller_id: str) -> Shop:
        shop = Shop(id=str(uuid.uuid4()), seller_id=seller_id, **data.model_dump())
        db.add(shop)
        await db.flush()
        await db.refresh(shop)
        return shop

    async def update_shop(self, db: AsyncSession, shop: Shop, data: ShopUpdate) -> Shop:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(shop, field, value)
        await db.flush()
        await db.refresh(shop)
        return shop


crud_shop = CRUDShop(Shop)
