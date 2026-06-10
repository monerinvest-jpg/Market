from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate
from app.crud.base import CRUDBase
import uuid


class CRUDCart(CRUDBase[CartItem]):
    async def get_user_cart(self, db: AsyncSession, user_id: str) -> List[CartItem]:
        result = await db.execute(
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .options(selectinload(CartItem.product))
        )
        return result.scalars().all()

    async def add_item(self, db: AsyncSession, user_id: str, data: CartItemCreate) -> CartItem:
        # Check if already exists
        result = await db.execute(
            select(CartItem).where(
                CartItem.user_id == user_id,
                CartItem.product_id == data.product_id,
                CartItem.variant == (data.variant or ""),
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.quantity += data.quantity
            await db.flush()
            await db.refresh(existing)
            return existing

        item = CartItem(
            id=str(uuid.uuid4()),
            user_id=user_id,
            product_id=data.product_id,
            quantity=data.quantity,
            variant=data.variant or "",
        )
        db.add(item)
        await db.flush()
        await db.refresh(item)
        return item

    async def clear_cart(self, db: AsyncSession, user_id: str) -> None:
        items = await self.get_user_cart(db, user_id)
        for item in items:
            await db.delete(item)


crud_cart = CRUDCart(CartItem)
