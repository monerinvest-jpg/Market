from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.favorite import Favorite
from app.crud.base import CRUDBase
import uuid


class CRUDFavorite(CRUDBase[Favorite]):
    async def get_user_favorites(self, db: AsyncSession, user_id: str) -> List[Favorite]:
        result = await db.execute(
            select(Favorite)
            .where(Favorite.user_id == user_id)
            .options(selectinload(Favorite.product))
            .order_by(Favorite.created_at.desc())
        )
        return result.scalars().all()

    async def toggle(self, db: AsyncSession, user_id: str, product_id: str) -> bool:
        """Returns True if added, False if removed."""
        result = await db.execute(
            select(Favorite).where(Favorite.user_id == user_id, Favorite.product_id == product_id)
        )
        existing = result.scalar_one_or_none()
        if existing:
            await db.delete(existing)
            return False
        fav = Favorite(id=str(uuid.uuid4()), user_id=user_id, product_id=product_id)
        db.add(fav)
        return True


crud_favorite = CRUDFavorite(Favorite)
