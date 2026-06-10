from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.promo_code import PromoCode
from app.crud.base import CRUDBase
import uuid


class CRUDPromo(CRUDBase[PromoCode]):
    async def get_by_code(self, db: AsyncSession, code: str) -> Optional[PromoCode]:
        result = await db.execute(
            select(PromoCode).where(PromoCode.code == code.upper(), PromoCode.is_active == True)
        )
        return result.scalar_one_or_none()

    async def create_promo(self, db: AsyncSession, data) -> PromoCode:
        promo = PromoCode(id=str(uuid.uuid4()), code=data.code.upper(), **data.model_dump(exclude={"code"}))
        db.add(promo)
        await db.flush()
        await db.refresh(promo)
        return promo

    async def toggle(self, db: AsyncSession, promo: PromoCode) -> PromoCode:
        promo.is_active = not promo.is_active
        await db.flush()
        await db.refresh(promo)
        return promo


crud_promo = CRUDPromo(PromoCode)
